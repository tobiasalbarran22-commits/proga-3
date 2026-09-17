/**
 * Errores del backend traducidos a algo que el frontend pueda usar.
 *
 * Los formularios comparan `codigo`, NUNCA el texto del mensaje: el texto
 * puede cambiar en el backend sin aviso, el código no.
 */

export type CodigoError =
  | "CREDENCIALES_INVALIDAS"
  | "CUENTA_SUSPENDIDA"
  | "EMAIL_REGISTRADO"
  | "CUIT_REGISTRADO"
  | "PERFIL_EXISTENTE"
  | "CODIGO_INVALIDO"
  | "TOKEN_INVALIDO"
  | "CONTRASENA_INCORRECTA"
  | "YA_POSTULADO"
  | "NO_AUTENTICADO"
  | "SIN_PERMISO"
  | "NO_ENCONTRADO"
  | "DATOS_INVALIDOS"
  | "TIEMPO_AGOTADO"
  | "SIN_CONEXION"
  | "DESCONOCIDO";

/** Códigos que el backend puede mandar en el campo `code`. */
const CODIGOS_DEL_BACKEND = [
  "CREDENCIALES_INVALIDAS",
  "CUENTA_SUSPENDIDA",
  "EMAIL_REGISTRADO",
  "CUIT_REGISTRADO",
  "PERFIL_EXISTENTE",
  "CODIGO_INVALIDO",
  "TOKEN_INVALIDO",
  "CONTRASENA_INCORRECTA",
  "YA_POSTULADO",
] as const satisfies readonly CodigoError[];

/** Guarda de tipo: le confirma a TypeScript que el texto es uno de los códigos conocidos. */
function esCodigoDelBackend(valor: string): valor is (typeof CODIGOS_DEL_BACKEND)[number] {
  return CODIGOS_DEL_BACKEND.some((codigo) => codigo === valor);
}

export class ApiError extends Error {
  constructor(
    readonly estado: number,
    readonly codigo: CodigoError,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = "ApiError";
  }
}

/** Mensaje que se muestra al usuario para cada código. */
const MENSAJES: Record<CodigoError, string> = {
  CREDENCIALES_INVALIDAS: "El email o la contraseña no son correctos.",
  CUENTA_SUSPENDIDA: "Tu cuenta está suspendida. Escribinos a soporte para revisarla.",
  EMAIL_REGISTRADO: "Ya existe una cuenta con ese email.",
  CUIT_REGISTRADO: "Ya existe una empresa registrada con ese CUIT.",
  PERFIL_EXISTENTE: "Ya tenés un perfil creado.",
  CODIGO_INVALIDO: "El código no es correcto o ya venció.",
  TOKEN_INVALIDO: "El enlace venció o ya se usó. Pedí uno nuevo.",
  CONTRASENA_INCORRECTA: "La contraseña actual no es correcta.",
  YA_POSTULADO: "Ya te postulaste a este empleo.",
  NO_AUTENTICADO: "Tu sesión terminó. Iniciá sesión de nuevo.",
  SIN_PERMISO: "No tenés permiso para hacer esto.",
  NO_ENCONTRADO: "No encontramos lo que buscabas.",
  DATOS_INVALIDOS: "Revisá los datos ingresados.",
  TIEMPO_AGOTADO: "El servidor tardó demasiado en responder. Probá de nuevo.",
  SIN_CONEXION: "No pudimos conectar con el servidor. Revisá tu conexión.",
  DESCONOCIDO: "Ocurrió un error inesperado. Probá de nuevo.",
};

export function mensajeParaUsuario(error: unknown): string {
  if (error instanceof ApiError) return MENSAJES[error.codigo];
  return MENSAJES.DESCONOCIDO;
}

/**
 * Un 401 significa cosas distintas según la ruta: en /login es "las
 * credenciales están mal" (todavía no hay sesión que pueda haber vencido),
 * en cualquier otro lado es "la sesión venció".
 */
function codigoPorEstado(estado: number, ruta?: string): CodigoError {
  if (estado === 401) return ruta === "/login" ? "CREDENCIALES_INVALIDAS" : "NO_AUTENTICADO";
  if (estado === 403) return "SIN_PERMISO";
  if (estado === 404) return "NO_ENCONTRADO";
  if (estado === 422) return "DATOS_INVALIDOS";
  return "DESCONOCIDO";
}

/**
 * FastAPI manda `detail` como texto o, en los errores 422, como una lista
 * de objetos `{ loc, msg, type }`. Esta función devuelve siempre un texto.
 */
export function extraerDetalle(cuerpo: unknown): string {
  if (typeof cuerpo !== "object" || cuerpo === null || !("detail" in cuerpo)) return "";
  const { detail } = cuerpo;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item: unknown) =>
        typeof item === "object" && item !== null && "msg" in item ? String(item.msg) : "",
      )
      .filter(Boolean)
      .join(". ");
  }
  return "";
}

/** Convierte una respuesta HTTP fallida en un ApiError. `ruta` es la que se llamó (ver codigoPorEstado). */
export function errorDesdeRespuesta(estado: number, cuerpo: unknown, ruta?: string): ApiError {
  const codigoRecibido =
    typeof cuerpo === "object" && cuerpo !== null && "code" in cuerpo ? String(cuerpo.code) : "";
  const codigo = esCodigoDelBackend(codigoRecibido) ? codigoRecibido : codigoPorEstado(estado, ruta);
  return new ApiError(estado, codigo, extraerDetalle(cuerpo) || MENSAJES[codigo]);
}

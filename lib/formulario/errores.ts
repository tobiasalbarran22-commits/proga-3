import { ApiError, mensajeParaUsuario, type CodigoError } from "@/lib/api/errores";

/** Un error que corresponde a un campo puntual del formulario. */
export class ErrorDeCampo extends Error {
  constructor(
    readonly campo: string,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = "ErrorDeCampo";
  }
}

/**
 * Si el error del backend corresponde a un campo, lo convierte en
 * ErrorDeCampo para mostrarlo debajo de ese campo. Si no, lo relanza igual.
 *
 * Ejemplo: vincularErrores(error, { EMAIL_REGISTRADO: "email" })
 */
export function vincularErrores(
  error: unknown,
  campos: Partial<Record<CodigoError, string>>,
): never {
  if (error instanceof ApiError) {
    const campo = campos[error.codigo];
    if (campo) throw new ErrorDeCampo(campo, mensajeParaUsuario(error));
  }
  throw error;
}

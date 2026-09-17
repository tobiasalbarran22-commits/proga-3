/**
 * Cliente HTTP: el único lugar del proyecto que llama a fetch.
 *
 * Se encarga de:
 *  - armar la URL con la base de lib/config,
 *  - mandar las cookies de sesión (en el navegador y en el servidor),
 *  - cortar el pedido si tarda demasiado,
 *  - renovar la sesión una vez si el backend responde 401 (solo en el navegador),
 *  - convertir cualquier fallo en un ApiError.
 */

import { config, TIEMPO_MAXIMO_PEDIDO_MS } from "@/lib/config";
import { ApiError, errorDesdeRespuesta } from "./errores";

const esServidor = typeof window === "undefined";

type Opciones = {
  metodo?: "GET" | "POST" | "PUT" | "DELETE";
  /** Se manda como JSON. */
  cuerpo?: unknown;
  /** Se manda como formulario (lo usa solo el login). */
  formulario?: Record<string, string>;
};

/**
 * En el servidor, el navegador no está para mandar las cookies solo:
 * hay que reenviar a mano las que llegaron en el pedido original.
 * El import es dinámico porque next/headers no existe en el navegador.
 */
async function cabeceraCookies(): Promise<Record<string, string>> {
  if (!esServidor) return {};
  const { cookies } = await import("next/headers");
  const almacen = await cookies();
  return { cookie: almacen.toString() };
}

async function enviar(ruta: string, opciones: Opciones): Promise<Response> {
  const cabeceras: Record<string, string> = await cabeceraCookies();
  let cuerpo: BodyInit | undefined;

  if (opciones.formulario) {
    cabeceras["Content-Type"] = "application/x-www-form-urlencoded";
    cuerpo = new URLSearchParams(opciones.formulario).toString();
  } else if (opciones.cuerpo !== undefined) {
    cabeceras["Content-Type"] = "application/json";
    cuerpo = JSON.stringify(opciones.cuerpo);
  }

  try {
    return await fetch(`${config.apiUrl}${ruta}`, {
      method: opciones.metodo ?? "GET",
      headers: cabeceras,
      body: cuerpo,
      credentials: "include",
      cache: "no-store",
      signal: AbortSignal.timeout(TIEMPO_MAXIMO_PEDIDO_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError(0, "TIEMPO_AGOTADO", "Tiempo agotado");
    }
    throw new ApiError(0, "SIN_CONEXION", "Sin conexión");
  }
}

const RUTAS_SIN_RENOVACION = new Set(["/login", "/refresh"]);

// Si varios pedidos reciben 401 a la vez, todos esperan la MISMA renovación.
let renovacionEnCurso: Promise<boolean> | null = null;

export function renovarSesion(): Promise<boolean> {
  renovacionEnCurso ??= enviar("/refresh", { metodo: "POST" })
    .then((respuesta) => respuesta.ok)
    .catch(() => false)
    .finally(() => {
      renovacionEnCurso = null;
    });
  return renovacionEnCurso;
}

/**
 * Hace un pedido al backend y devuelve el cuerpo sin validar.
 * Cada módulo de lib/api valida ese cuerpo con su esquema de Zod.
 */
export async function pedir(ruta: string, opciones: Opciones = {}): Promise<unknown> {
  let respuesta = await enviar(ruta, opciones);

  // En el servidor no se puede guardar la cookie nueva: de eso se encarga proxy.ts.
  // En /login y /refresh un 401 significa "datos incorrectos", no "sesión vencida".
  if (respuesta.status === 401 && !esServidor && !RUTAS_SIN_RENOVACION.has(ruta)) {
    if (await renovarSesion()) respuesta = await enviar(ruta, opciones);
  }

  const cuerpo: unknown = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw errorDesdeRespuesta(respuesta.status, cuerpo);
  return cuerpo;
}

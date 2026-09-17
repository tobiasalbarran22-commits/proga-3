import { config } from "@/lib/config";

/**
 * Renovación de sesión usada por proxy.ts.
 * A diferencia de `renovarSesion` del cliente, acá hay que reenviar las
 * cookies a mano y devolver las nuevas para que el proxy las guarde.
 * Devuelve la lista de cabeceras Set-Cookie (vacía si no se pudo renovar).
 */
export async function renovarSesionDesdeProxy(cookie: string): Promise<string[]> {
  try {
    const respuesta = await fetch(`${config.apiUrl}/refresh`, {
      method: "POST",
      headers: { cookie },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    return respuesta.ok ? respuesta.headers.getSetCookie() : [];
  } catch {
    return [];
  }
}

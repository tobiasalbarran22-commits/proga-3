/**
 * proxy.ts (en Next 15 se llamaba middleware.ts)
 *
 * Corre antes de renderizar cualquier página privada y hace dos cosas rápidas:
 *  1. Si no hay ninguna cookie de sesión, redirige a /login sin renderizar nada.
 *  2. Si venció la cookie de acceso pero queda la de renovación, pide una
 *     nueva al backend y la guarda antes de seguir. Esto no lo puede hacer
 *     una página, porque las páginas no pueden escribir cookies.
 *
 * No valida el rol: eso lo hacen los layouts con lib/sesion.ts.
 */

import { NextResponse, type NextRequest } from "next/server";
import { renovarSesionDesdeProxy } from "@/lib/api/renovacion";
import { COOKIES } from "@/lib/config";
import { PREFIJOS_PRIVADOS, rutas } from "@/lib/rutas";

function esPrivada(pathname: string) {
  return PREFIJOS_PRIVADOS.some(
    (prefijo) => pathname === prefijo || pathname.startsWith(`${prefijo}/`),
  );
}

export async function proxy(request: NextRequest) {
  if (!esPrivada(request.nextUrl.pathname)) return NextResponse.next();

  const tieneAcceso = request.cookies.has(COOKIES.acceso);
  const tieneRenovacion = request.cookies.has(COOKIES.renovacion);

  if (tieneAcceso) return NextResponse.next();

  if (tieneRenovacion) {
    const cookiesNuevas = await renovarSesionDesdeProxy(request.headers.get("cookie") ?? "");
    if (cookiesNuevas.length > 0) {
      // La página de este mismo pedido tiene que ver ya la cookie nueva…
      const cabeceras = new Headers(request.headers);
      const pares = cookiesNuevas.map((c) => c.split(";")[0]).join("; ");
      cabeceras.set("cookie", `${request.headers.get("cookie") ?? ""}; ${pares}`);
      const respuesta = NextResponse.next({ request: { headers: cabeceras } });
      // …y el navegador la tiene que guardar para los pedidos siguientes.
      cookiesNuevas.forEach((c) => respuesta.headers.append("set-cookie", c));
      return respuesta;
    }
  }

  return NextResponse.redirect(new URL(rutas.login, request.url));
}

export const config = {
  // No corre sobre archivos estáticos, imágenes ni el backend simulado.
  matcher: ["/((?!_next/|api/|favicon|icon|.*\\.[a-z0-9]+$).*)"],
};

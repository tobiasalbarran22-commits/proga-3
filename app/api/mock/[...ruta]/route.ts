/**
 * Punto de entrada del backend simulado: /api/mock/<ruta del backend>.
 * Solo responde si MOCK_API_HABILITADO=true (ver .env.development).
 */

import { rutasAuth } from "@/mocks/rutas-auth";
import { rutasEmpleos } from "@/mocks/rutas-empleos";
import { rutasPerfil } from "@/mocks/rutas-perfil";
import { atender } from "@/mocks/servidor";

const RUTAS = [...rutasAuth, ...rutasPerfil, ...rutasEmpleos];

type Contexto = { params: Promise<{ ruta: string[] }> };

async function manejar(request: Request, { params }: Contexto) {
  if (process.env.MOCK_API_HABILITADO !== "true") {
    return new Response("Backend simulado deshabilitado", { status: 404 });
  }
  const { ruta } = await params;
  return atender(request, `/${ruta.join("/")}`, RUTAS);
}

export { manejar as GET, manejar as POST, manejar as PUT, manejar as DELETE };

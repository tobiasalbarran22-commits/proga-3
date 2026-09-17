import type { Metadata } from "next";
import { Pagina } from "@/components/layout/pagina";
import { ListaEmpleos } from "@/features/empleos/lista-empleos";
import { listarEmpleos, listarMisPostulaciones } from "@/lib/api/empleos";
import { exigirUsuarioVerificado } from "@/lib/sesion";

export const metadata: Metadata = { title: "Empleos" };

export default async function EmpleosPage() {
  const usuario = await exigirUsuarioVerificado();

  // Solo el trabajador se postula, así que solo él necesita saber a qué ya se postuló.
  const [empleos, postulaciones] = await Promise.all([
    listarEmpleos(),
    usuario.tipo === "TRABAJADOR" ? listarMisPostulaciones() : Promise.resolve([]),
  ]);

  return (
    <Pagina titulo="Empleos" bajada="Búsquedas de tecnología publicadas por empresas de Argentina.">
      <ListaEmpleos empleos={empleos} postulados={new Set(postulaciones.map((p) => p.empleoId))} />
    </Pagina>
  );
}

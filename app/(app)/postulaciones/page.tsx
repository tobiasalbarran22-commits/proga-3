import type { Metadata } from "next";
import { Pagina } from "@/components/layout/pagina";
import { MisPostulaciones } from "@/features/postulaciones/mis-postulaciones";
import { PostulantesPorBusqueda } from "@/features/postulaciones/postulantes-por-busqueda";
import { listarMisEmpleos, listarMisPostulaciones, listarPostulantes } from "@/lib/api/empleos";
import { exigirRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Postulaciones" };

/** El trabajador ve sus postulaciones; la empresa, quién se postuló a cada búsqueda. */
export default async function PostulacionesPage() {
  const usuario = await exigirRol("TRABAJADOR", "EMPRESA");

  if (usuario.tipo === "TRABAJADOR") {
    const postulaciones = await listarMisPostulaciones();
    return (
      <Pagina
        titulo="Mis postulaciones"
        bajada="El estado de cada búsqueda a la que te postulaste."
      >
        <MisPostulaciones postulaciones={postulaciones} />
      </Pagina>
    );
  }

  const empleos = await listarMisEmpleos();
  const busquedas = await Promise.all(
    empleos.map(async (empleo) => ({ empleo, postulantes: await listarPostulantes(empleo.id) })),
  );

  return (
    <Pagina titulo="Postulantes" bajada="Las personas que se postularon a tus búsquedas.">
      <PostulantesPorBusqueda busquedas={busquedas} />
    </Pagina>
  );
}

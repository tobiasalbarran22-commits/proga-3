import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagina } from "@/components/layout/pagina";
import { BotonPostularme } from "@/features/empleos/boton-postularme";
import { DetalleEmpleo } from "@/features/empleos/detalle-empleo";
import { listarMisPostulaciones, obtenerEmpleo } from "@/lib/api/empleos";
import { rutas } from "@/lib/rutas";
import { exigirUsuarioVerificado } from "@/lib/sesion";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const empleo = await obtenerEmpleo((await params).id);
  return { title: empleo?.titulo ?? "Empleo" };
}

/** Detalle con URL propia: se puede compartir y abrir en otra pestaña. */
export default async function EmpleoPage({ params }: Props) {
  const { id } = await params;
  const usuario = await exigirUsuarioVerificado();
  const empleo = await obtenerEmpleo(id);
  if (!empleo) notFound();

  let accion = null;
  if (usuario.tipo === "TRABAJADOR") {
    const postulaciones = await listarMisPostulaciones();
    const yaPostulado = postulaciones.some((p) => p.empleoId === empleo.id);
    accion = <BotonPostularme empleoId={empleo.id} yaPostulado={yaPostulado} />;
  }

  return (
    <Pagina titulo={empleo.titulo} bajada={empleo.empresaNombre}>
      <Link
        href={rutas.empleos}
        className="mb-4 inline-block text-sm font-semibold text-bordo hover:underline"
      >
        Volver a empleos
      </Link>
      <DetalleEmpleo empleo={empleo} accion={accion} />
    </Pagina>
  );
}

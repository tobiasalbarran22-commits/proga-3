import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { formatearFecha } from "@/lib/etiquetas";
import { rutas } from "@/lib/rutas";
import type { Postulacion } from "@/types/postulacion";
import { EstadoPostulacionBadge } from "./estado-postulacion";

export function MisPostulaciones({ postulaciones }: { postulaciones: Postulacion[] }) {
  if (postulaciones.length === 0) {
    return (
      <EmptyState
        mensaje="Todavía no te postulaste a ningún empleo."
        accion={<ButtonLink href={rutas.empleos}>Ver empleos</ButtonLink>}
      />
    );
  }

  return (
    <ul className="divide-y divide-linea rounded-2xl border border-linea bg-fondo">
      {postulaciones.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <Link
              href={rutas.empleo(p.empleoId)}
              className="font-medium text-tinta hover:underline"
            >
              {p.empleoTitulo}
            </Link>
            <p className="text-sm text-tinta-suave">
              {p.empresaNombre} · {formatearFecha(p.fecha)}
            </p>
          </div>
          <EstadoPostulacionBadge estado={p.estado} />
        </li>
      ))}
    </ul>
  );
}

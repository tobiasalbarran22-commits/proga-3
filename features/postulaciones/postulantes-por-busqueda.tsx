import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { formatearFecha } from "@/lib/etiquetas";
import type { Empleo } from "@/types/empleo";
import type { Postulante } from "@/types/postulacion";
import { EstadoPostulacionBadge } from "./estado-postulacion";

export type BusquedaConPostulantes = { empleo: Empleo; postulantes: Postulante[] };

function ListaPostulantes({ postulantes }: { postulantes: Postulante[] }) {
  if (postulantes.length === 0) {
    return <EmptyState mensaje="Todavía no se postuló nadie." />;
  }
  return (
    <ul className="divide-y divide-linea">
      {postulantes.map((p) => (
        <li
          key={p.postulacionId}
          className="flex flex-wrap items-center justify-between gap-3 py-3"
        >
          <div className="min-w-0">
            <p className="font-medium text-tinta">{p.nombreCompleto}</p>
            <p className="text-sm break-words text-tinta-suave">
              {[p.tituloProfesional, p.email, formatearFecha(p.fecha)].filter(Boolean).join(" · ")}
            </p>
          </div>
          <EstadoPostulacionBadge estado={p.estado} />
        </li>
      ))}
    </ul>
  );
}

export function PostulantesPorBusqueda({ busquedas }: { busquedas: BusquedaConPostulantes[] }) {
  if (busquedas.length === 0) {
    return <EmptyState mensaje="Tu empresa todavía no publicó búsquedas." />;
  }
  return (
    <div className="flex flex-col gap-5">
      {busquedas.map(({ empleo, postulantes }) => (
        <Panel
          key={empleo.id}
          titulo={empleo.titulo}
          descripcion={`${postulantes.length} ${postulantes.length === 1 ? "postulante" : "postulantes"}`}
        >
          <ListaPostulantes postulantes={postulantes} />
        </Panel>
      ))}
    </div>
  );
}

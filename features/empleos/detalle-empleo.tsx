import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ETIQUETA_MODALIDAD, formatearFecha } from "@/lib/etiquetas";
import type { Empleo } from "@/types/empleo";

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold text-tinta">{titulo}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-tinta-suave">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

type Props = {
  empleo: Empleo;
  /** Acción al pie (por ejemplo, el botón para postularse). */
  accion?: ReactNode;
};

export function DetalleEmpleo({ empleo, accion }: Props) {
  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-linea bg-fondo p-6 sm:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tono="marca">{ETIQUETA_MODALIDAD[empleo.modalidad]}</Badge>
          <span className="text-sm text-tinta-tenue">
            Publicado el {formatearFecha(empleo.fechaPublicacion)}
          </span>
        </div>
        <p className="text-tinta-suave">
          {empleo.empresaNombre} · {empleo.ubicacion}
        </p>
        <p className="text-lg font-semibold text-tinta">
          {empleo.remuneracion ?? "Remuneración a convenir"}
        </p>
      </header>

      <p className="leading-relaxed whitespace-pre-line text-tinta">{empleo.descripcion}</p>

      <Lista titulo="Requisitos" items={empleo.requisitos} />
      <Lista titulo="Beneficios" items={empleo.beneficios} />

      <section>
        <h2 className="text-lg font-semibold text-tinta">Habilidades</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {empleo.habilidades.map((h) => (
            <li key={h}>
              <Badge>{h}</Badge>
            </li>
          ))}
        </ul>
      </section>

      {accion && <footer className="border-t border-linea pt-5">{accion}</footer>}
    </article>
  );
}

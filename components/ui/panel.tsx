import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  titulo: string;
  descripcion?: string;
  /** Botón o enlace que se muestra a la derecha del título. */
  accion?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Sección con título: la unidad básica de las pantallas internas. */
export function Panel({ titulo, descripcion, accion, children, className }: Props) {
  const idTitulo = useId();
  return (
    <section
      aria-labelledby={idTitulo}
      className={cn("rounded-2xl border border-linea bg-fondo p-5 sm:p-6", className)}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={idTitulo} className="text-lg font-semibold text-tinta">
            {titulo}
          </h2>
          {descripcion && <p className="mt-0.5 text-sm text-tinta-suave">{descripcion}</p>}
        </div>
        {accion}
      </header>
      {children}
    </section>
  );
}

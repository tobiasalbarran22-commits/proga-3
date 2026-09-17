import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ETIQUETA_MODALIDAD } from "@/lib/etiquetas";
import { rutas } from "@/lib/rutas";
import type { Empleo } from "@/types/empleo";

/**
 * Tarjeta de un empleo. El título es un enlace real: se abre con teclado,
 * se puede abrir en otra pestaña y el lector de pantalla lo anuncia bien.
 * El truco `after:absolute after:inset-0` hace que toda la tarjeta sea clickeable
 * sin meter un botón dentro de otro elemento interactivo.
 */
export function TarjetaEmpleo({ empleo, yaPostulado }: { empleo: Empleo; yaPostulado: boolean }) {
  return (
    <article className="relative flex flex-col gap-3 rounded-2xl border border-linea bg-fondo p-5 transition-shadow focus-within:ring-2 focus-within:ring-bordo hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-tinta">
            <Link
              href={rutas.empleo(empleo.id)}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl"
            >
              {empleo.titulo}
            </Link>
          </h2>
          <p className="text-sm text-tinta-suave">
            {empleo.empresaNombre} · {empleo.ubicacion}
          </p>
        </div>
        <Badge tono="marca">{ETIQUETA_MODALIDAD[empleo.modalidad]}</Badge>
      </div>

      <p className="text-sm text-tinta-suave">{empleo.resumen}</p>

      <ul className="flex flex-wrap gap-2" aria-label="Habilidades">
        {empleo.habilidades.map((h) => (
          <li key={h}>
            <Badge>{h}</Badge>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-linea pt-3 text-sm">
        <span className="font-medium text-tinta">
          {empleo.remuneracion ?? "Remuneración a convenir"}
        </span>
        {yaPostulado && <Badge tono="exito">Ya te postulaste</Badge>}
      </div>
    </article>
  );
}

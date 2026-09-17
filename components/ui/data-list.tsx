import type { ReactNode } from "react";

export type Dato = { etiqueta: string; valor: ReactNode };

/** Lista de pares "etiqueta: valor". Los valores vacíos se muestran como un guion. */
export function DataList({ datos }: { datos: Dato[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {datos.map(({ etiqueta, valor }) => (
        <div key={etiqueta} className="min-w-0">
          <dt className="text-xs font-medium text-tinta-tenue">{etiqueta}</dt>
          <dd className="mt-0.5 text-sm break-words text-tinta">
            {valor === null || valor === undefined || valor === "" ? "—" : valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}

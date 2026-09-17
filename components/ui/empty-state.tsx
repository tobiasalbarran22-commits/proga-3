import type { ReactNode } from "react";

/** Qué mostrar cuando una lista está vacía: explica y, si corresponde, invita a actuar. */
export function EmptyState({ mensaje, accion }: { mensaje: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-linea-fuerte px-4 py-5">
      <p className="text-sm text-tinta-suave">{mensaje}</p>
      {accion}
    </div>
  );
}

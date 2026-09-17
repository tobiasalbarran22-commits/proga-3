"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type Props = {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
};

/**
 * Ventana modal basada en el elemento nativo <dialog>. El navegador ya
 * resuelve lo difícil: atrapa el foco, cierra con Escape y vuelve el foco
 * al elemento que la abrió.
 */
export function Dialog({ abierto, titulo, onCerrar, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={onCerrar}
      className="m-auto w-full max-w-lg rounded-2xl bg-fondo p-0 text-tinta backdrop:bg-tinta/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-linea px-6 py-4">
        <h2 id={idTitulo} className="text-lg font-semibold">
          {titulo}
        </h2>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onCerrar}
          className="rounded-full px-2 text-xl leading-none text-tinta-suave hover:bg-fondo-suave"
        >
          ×
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}

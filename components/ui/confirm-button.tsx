"use client";

import { useState, type ReactNode } from "react";
import { Button } from "./button";

type Props = {
  children: ReactNode;
  /** Pregunta que se muestra antes de confirmar. */
  pregunta: string;
  textoConfirmar: string;
  onConfirmar: () => Promise<void> | void;
};

/**
 * Botón para acciones destructivas: el primer clic solo pregunta,
 * la acción ocurre recién al confirmar.
 */
export function ConfirmButton({ children, pregunta, textoConfirmar, onConfirmar }: Props) {
  const [preguntando, setPreguntando] = useState(false);
  const [ejecutando, setEjecutando] = useState(false);

  async function confirmar() {
    setEjecutando(true);
    try {
      await onConfirmar();
    } finally {
      setEjecutando(false);
      setPreguntando(false);
    }
  }

  if (!preguntando) {
    return (
      <Button variante="enlace" className="text-error" onClick={() => setPreguntando(true)}>
        {children}
      </Button>
    );
  }

  return (
    <div role="group" aria-label={pregunta} className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-tinta">{pregunta}</span>
      <Button variante="peligro" tamano="sm" cargando={ejecutando} onClick={confirmar}>
        {textoConfirmar}
      </Button>
      <Button
        variante="secundario"
        tamano="sm"
        disabled={ejecutando}
        onClick={() => setPreguntando(false)}
      >
        Cancelar
      </Button>
    </div>
  );
}

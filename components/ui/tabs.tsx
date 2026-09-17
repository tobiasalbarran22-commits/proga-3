"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Pestana = { id: string; etiqueta: string; contenido: ReactNode };

/**
 * Pestañas accesibles: roles tablist/tab/tabpanel y navegación con
 * las flechas, como indica la guía de prácticas de ARIA.
 */
export function Tabs({ pestanas, etiqueta }: { pestanas: Pestana[]; etiqueta: string }) {
  const [activa, setActiva] = useState(0);
  const base = useId();
  const botones = useRef<(HTMLButtonElement | null)[]>([]);

  function mover(evento: KeyboardEvent, indice: number) {
    const destinos: Record<string, number> = {
      ArrowRight: (indice + 1) % pestanas.length,
      ArrowLeft: (indice - 1 + pestanas.length) % pestanas.length,
      Home: 0,
      End: pestanas.length - 1,
    };
    const destino = destinos[evento.key];
    if (destino === undefined) return;
    evento.preventDefault();
    setActiva(destino);
    botones.current[destino]?.focus();
  }

  const actual = pestanas[activa];

  return (
    <div>
      <div
        role="tablist"
        aria-label={etiqueta}
        className="flex w-fit flex-wrap gap-1 rounded-xl bg-fondo-suave p-1"
      >
        {pestanas.map((pestana, i) => (
          <button
            key={pestana.id}
            ref={(el) => {
              botones.current[i] = el;
            }}
            id={`${base}-tab-${pestana.id}`}
            type="button"
            role="tab"
            aria-selected={i === activa}
            aria-controls={`${base}-panel`}
            tabIndex={i === activa ? 0 : -1}
            onClick={() => setActiva(i)}
            onKeyDown={(e) => mover(e, i)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              i === activa ? "bg-bordo text-white" : "text-tinta-suave hover:text-tinta",
            )}
          >
            {pestana.etiqueta}
          </button>
        ))}
      </div>
      {actual && (
        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${actual.id}`}
          tabIndex={0}
          className="mt-5"
        >
          {actual.contenido}
        </div>
      )}
    </div>
  );
}

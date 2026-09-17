"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "./button";
import type { PropsControl } from "./field";
import { Input } from "./input";

type Props = PropsControl & {
  /** Nombre del campo en el formulario. Cada valor se envía como `${name}[]`. */
  name: string;
  inicial?: string[];
  placeholder?: string;
  maximo?: number;
};

/**
 * Carga una lista de palabras (habilidades, áreas de interés…).
 * Se agrega con Enter, coma o el botón, y se quita con la ×.
 * Los valores viajan en inputs ocultos, así el formulario los lee
 * igual que cualquier otro campo (ver lib/formulario/leer-formulario.ts).
 */
export function TagInput({ name, inicial = [], placeholder, maximo = 30, ...control }: Props) {
  const [valores, setValores] = useState(inicial);
  const [texto, setTexto] = useState("");
  const lleno = valores.length >= maximo;

  function agregar() {
    const limpio = texto.trim();
    const repetido = valores.some((v) => v.toLowerCase() === limpio.toLowerCase());
    if (limpio && !repetido && !lleno) setValores([...valores, limpio]);
    setTexto("");
  }

  function alPresionarTecla(evento: KeyboardEvent<HTMLInputElement>) {
    // Enter agrega la etiqueta en lugar de enviar el formulario.
    if (evento.key === "Enter" || evento.key === ",") {
      evento.preventDefault();
      agregar();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          {...control}
          value={texto}
          placeholder={lleno ? `Máximo ${maximo}` : placeholder}
          disabled={lleno}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={alPresionarTecla}
        />
        <Button variante="secundario" onClick={agregar} disabled={lleno}>
          Agregar
        </Button>
      </div>

      {valores.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {valores.map((valor) => (
            <li
              key={valor}
              className="inline-flex items-center gap-1 rounded-full bg-bordo-claro py-0.5 pr-1 pl-3 text-xs font-medium text-bordo"
            >
              {valor}
              <input type="hidden" name={`${name}[]`} value={valor} />
              <button
                type="button"
                aria-label={`Quitar ${valor}`}
                onClick={() => setValores(valores.filter((v) => v !== valor))}
                className="rounded-full px-1.5 text-base leading-none hover:bg-bordo hover:text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

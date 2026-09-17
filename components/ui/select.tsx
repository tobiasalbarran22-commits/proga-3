import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { CLASES_CONTROL } from "./control-estilos";

export type Opcion = { valor: string; etiqueta: string };

type Props = ComponentProps<"select"> & {
  opciones: Opcion[];
  /** Texto de la opción vacía inicial. Si se omite, no hay opción vacía. */
  placeholder?: string;
};

export function Select({ opciones, placeholder, className, ...props }: Props) {
  return (
    <select className={cn(CLASES_CONTROL, className)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {opciones.map((opcion) => (
        <option key={opcion.valor} value={opcion.valor}>
          {opcion.etiqueta}
        </option>
      ))}
    </select>
  );
}

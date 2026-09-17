import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tono = "neutro" | "marca" | "exito" | "aviso";

const TONOS: Record<Tono, string> = {
  neutro: "bg-fondo-suave text-tinta-suave border border-linea",
  marca: "bg-bordo-claro text-bordo",
  exito: "bg-exito-claro text-exito",
  aviso: "bg-aviso-claro text-aviso",
};

/** Etiqueta chica para estados, modalidades o habilidades. */
export function Badge({ tono = "neutro", children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONOS[tono],
      )}
    >
      {children}
    </span>
  );
}

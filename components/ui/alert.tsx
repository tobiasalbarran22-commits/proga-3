import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tipo = "error" | "exito" | "aviso";

const ESTILOS: Record<Tipo, string> = {
  error: "bg-error-claro text-error",
  exito: "bg-exito-claro text-exito",
  aviso: "bg-aviso-claro text-aviso",
};

/**
 * Mensaje destacado. Los errores usan role="alert" (se anuncian enseguida);
 * el resto role="status" (se anuncian sin interrumpir).
 */
export function Alert({
  tipo,
  children,
  className,
}: {
  tipo: Tipo;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={cn("rounded-lg px-3.5 py-2.5 text-sm", ESTILOS[tipo], className)}
    >
      {children}
    </div>
  );
}

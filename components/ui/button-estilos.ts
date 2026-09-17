import { cn } from "@/lib/utils";

export type VarianteBoton = "primario" | "secundario" | "peligro" | "enlace";
export type TamanoBoton = "md" | "sm";

const VARIANTES: Record<VarianteBoton, string> = {
  primario: "bg-bordo text-white hover:bg-bordo-oscuro",
  secundario: "border border-linea-fuerte bg-fondo text-tinta hover:bg-fondo-suave",
  peligro: "bg-error text-white hover:opacity-90",
  enlace: "text-bordo underline-offset-4 hover:underline",
};

const TAMANOS: Record<TamanoBoton, string> = {
  md: "px-4 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-sm",
};

/**
 * Clases de un botón. Están separadas del componente para que un <Link>
 * pueda verse igual que un botón (ver button-link.tsx).
 */
export function clasesBoton(variante: VarianteBoton = "primario", tamano: TamanoBoton = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTES[variante],
    variante === "enlace" ? "p-0 text-sm" : TAMANOS[tamano],
  );
}

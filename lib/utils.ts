import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind. Si dos clases chocan (por ejemplo `px-2` y
 * `px-4`), gana la última, así un componente puede aceptar `className`
 * para ajustar su estilo sin pelearse con el suyo propio.
 */
export function cn(...clases: ClassValue[]) {
  return twMerge(clsx(clases));
}

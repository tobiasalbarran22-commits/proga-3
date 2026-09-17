import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { clasesBoton, type TamanoBoton, type VarianteBoton } from "./button-estilos";

type Props = ComponentProps<typeof Link> & {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
};

/** Un enlace con aspecto de botón: navega, no ejecuta una acción. */
export function ButtonLink({ variante, tamano, className, ...props }: Props) {
  return <Link className={cn(clasesBoton(variante, tamano), className)} {...props} />;
}

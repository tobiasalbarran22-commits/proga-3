import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { clasesBoton, type TamanoBoton, type VarianteBoton } from "./button-estilos";
import { Spinner } from "./spinner";

type Props = ComponentProps<"button"> & {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  /** Muestra un spinner y deshabilita el botón mientras dura una acción. */
  cargando?: boolean;
};

export function Button({
  variante,
  tamano,
  cargando = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      className={cn(clasesBoton(variante, tamano), className)}
      {...props}
    >
      {cargando && <Spinner />}
      {children}
    </button>
  );
}

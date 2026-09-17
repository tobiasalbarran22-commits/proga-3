import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { CLASES_CONTROL } from "./control-estilos";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(CLASES_CONTROL, className)} {...props} />;
}

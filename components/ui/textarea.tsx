import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { CLASES_CONTROL } from "./control-estilos";

export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(CLASES_CONTROL, className)} {...props} />;
}

import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Alert } from "./alert";
import { FormActions } from "./form-actions";

type Props = {
  onSubmit: (evento: FormEvent<HTMLFormElement>) => void;
  enviando: boolean;
  errorGeneral: string | null;
  onCancelar?: () => void;
  textoGuardar?: string;
  className?: string;
  children: ReactNode;
};

/** Marco común de un formulario: campos, error general y botón(es) de acción. */
export function Form({
  onSubmit,
  enviando,
  errorGeneral,
  onCancelar,
  textoGuardar,
  className,
  children,
}: Props) {
  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-4", className)}>
      {children}
      {errorGeneral && <Alert tipo="error">{errorGeneral}</Alert>}
      <FormActions enviando={enviando} onCancelar={onCancelar} textoGuardar={textoGuardar} />
    </form>
  );
}

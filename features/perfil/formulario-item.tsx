import type { FormEvent, ReactNode } from "react";
import { Form } from "@/components/ui/form";

type Props = {
  onSubmit: (evento: FormEvent<HTMLFormElement>) => void;
  enviando: boolean;
  errorGeneral: string | null;
  onCancelar: () => void;
  children: ReactNode;
};

/** Marco común de los formularios que aparecen dentro de una ListaEditable. */
export function FormularioItem({ onSubmit, enviando, errorGeneral, onCancelar, children }: Props) {
  return (
    <Form
      {...{ onSubmit, enviando, errorGeneral, onCancelar }}
      className="rounded-xl border border-linea-fuerte bg-fondo-suave p-4"
    >
      {children}
    </Form>
  );
}

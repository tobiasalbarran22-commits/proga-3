import { useId, type ReactNode } from "react";

/** Atributos que Field le pasa al control para dejarlo conectado con su label y su error. */
export type PropsControl = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type Props = {
  label: string;
  error?: string;
  ayuda?: string;
  /** Marca el campo como opcional en el label. */
  opcional?: boolean;
  children: (control: PropsControl) => ReactNode;
};

/**
 * Envuelve cualquier control (Input, Select, Textarea) con su label, texto de
 * ayuda y error. Genera los ids solo, así es imposible dejar un label sin asociar.
 *
 * Uso:
 *   <Field label="Email" error={errores.email}>
 *     {(control) => <Input {...control} name="email" type="email" />}
 *   </Field>
 */
export function Field({ label, error, ayuda, opcional, children }: Props) {
  const id = useId();
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const describedBy = [idAyuda, idError].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-tinta">
        {label}
        {opcional && <span className="font-normal text-tinta-tenue"> (opcional)</span>}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {ayuda && (
        <p id={idAyuda} className="text-xs text-tinta-tenue">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

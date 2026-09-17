import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Errores } from "@/lib/formulario/use-formulario";
import { LARGO_MINIMO_CONTRASENA } from "@/lib/formulario/reglas";

/** Contraseña nueva y su confirmación, usadas en registro y restablecimiento. */
export function CamposContrasena({ errores }: { errores: Errores }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Contraseña"
        error={errores.contrasena}
        ayuda={`Al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`}
      >
        {(control) => (
          <Input {...control} name="contrasena" type="password" autoComplete="new-password" />
        )}
      </Field>
      <Field label="Repetí la contraseña" error={errores.confirmacion}>
        {(control) => (
          <Input {...control} name="confirmacion" type="password" autoComplete="new-password" />
        )}
      </Field>
    </div>
  );
}

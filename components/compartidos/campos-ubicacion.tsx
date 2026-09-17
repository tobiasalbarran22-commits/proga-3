import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Errores } from "@/lib/formulario/use-formulario";
import type { Ubicacion } from "@/types/perfil";
import type { Pais } from "@/types/usuario";

type Props = {
  paises: Pais[];
  errores: Errores;
  /** Valores iniciales al editar. */
  inicial?: Partial<Ubicacion>;
};

/** País, provincia y ciudad: el mismo bloque en el registro y en los perfiles. */
export function CamposUbicacion({ paises, errores, inicial }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="País" error={errores.paisCodigo}>
        {(control) => (
          <Select
            {...control}
            name="paisCodigo"
            defaultValue={inicial?.paisCodigo ?? "AR"}
            opciones={paises.map((p) => ({ valor: p.codigo, etiqueta: p.nombre }))}
            placeholder="Elegí un país"
          />
        )}
      </Field>
      <Field label="Provincia" error={errores.provincia}>
        {(control) => (
          <Input
            {...control}
            name="provincia"
            autoComplete="address-level1"
            defaultValue={inicial?.provincia}
          />
        )}
      </Field>
      <Field label="Ciudad" error={errores.ciudad}>
        {(control) => (
          <Input
            {...control}
            name="ciudad"
            autoComplete="address-level2"
            defaultValue={inicial?.ciudad}
          />
        )}
      </Field>
    </div>
  );
}

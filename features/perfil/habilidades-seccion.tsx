"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { TagInput } from "@/components/ui/tag-input";
import { guardarMisHabilidades } from "@/lib/api/preferencias";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { esquemaHabilidades } from "./esquemas";
import { SeccionEditable, type PropsFormularioSeccion } from "./seccion-editable";

type Props = { habilidades: string[] };

function FormularioHabilidades({
  habilidades,
  onListo,
  onCancelar,
}: Props & PropsFormularioSeccion) {
  const { onSubmit, errorGeneral, enviando } = useFormulario(esquemaHabilidades, async (datos) => {
    await guardarMisHabilidades(datos.habilidades);
    onListo();
  });

  return (
    <Form {...{ onSubmit, enviando, errorGeneral, onCancelar }}>
      <Field label="Habilidades" ayuda="Escribí una y apretá Enter para agregarla.">
        {(c) => (
          <TagInput
            {...c}
            name="habilidades"
            inicial={habilidades}
            placeholder="Por ejemplo: React"
          />
        )}
      </Field>
    </Form>
  );
}

export function HabilidadesSeccion({ habilidades }: Props) {
  return (
    <SeccionEditable
      titulo="Habilidades"
      vista={
        habilidades.length === 0 ? (
          <EmptyState mensaje="Todavía no cargaste habilidades." />
        ) : (
          <ul className="flex flex-wrap gap-2">
            {habilidades.map((h) => (
              <li key={h}>
                <Badge tono="marca">{h}</Badge>
              </li>
            ))}
          </ul>
        )
      }
      formulario={(acciones) => <FormularioHabilidades habilidades={habilidades} {...acciones} />}
    />
  );
}

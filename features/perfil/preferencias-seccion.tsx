"use client";

import { DataList } from "@/components/ui/data-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { guardarMiPreferencia } from "@/lib/api/preferencias";
import { ETIQUETA_MODALIDAD, opcionesDe } from "@/lib/etiquetas";
import { useFormulario } from "@/lib/formulario/use-formulario";
import type { PreferenciaLaboral } from "@/types/perfil";
import { esquemaPreferencias } from "./esquemas";
import { SeccionEditable, type PropsFormularioSeccion } from "./seccion-editable";

type Props = { preferencia: PreferenciaLaboral | null };

function FormularioPreferencias({
  preferencia,
  onListo,
  onCancelar,
}: Props & PropsFormularioSeccion) {
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaPreferencias,
    async (datos) => {
      await guardarMiPreferencia(datos);
      onListo();
    },
  );

  return (
    <Form {...{ onSubmit, enviando, errorGeneral, onCancelar }}>
      <Field label="Áreas de interés" opcional>
        {(c) => (
          <TagInput
            {...c}
            name="areasInteres"
            inicial={preferencia?.areasInteres}
            placeholder="Por ejemplo: desarrollo web"
          />
        )}
      </Field>
      <Field label="Tipos de puesto" opcional>
        {(c) => (
          <TagInput
            {...c}
            name="tiposPuesto"
            inicial={preferencia?.tiposPuesto}
            placeholder="Por ejemplo: tiempo completo"
          />
        )}
      </Field>
      <Field label="Modalidad preferida" error={errores.modalidad}>
        {(c) => (
          <Select
            {...c}
            name="modalidad"
            defaultValue={preferencia?.modalidad ?? ""}
            placeholder="Elegí una modalidad"
            opciones={opcionesDe(ETIQUETA_MODALIDAD)}
          />
        )}
      </Field>
    </Form>
  );
}

export function PreferenciasSeccion({ preferencia }: Props) {
  return (
    <SeccionEditable
      titulo="Preferencias laborales"
      descripcion="Nos ayudan a mostrarte empleos que te interesen."
      vista={
        preferencia ? (
          <DataList
            datos={[
              { etiqueta: "Modalidad", valor: ETIQUETA_MODALIDAD[preferencia.modalidad] },
              { etiqueta: "Áreas de interés", valor: preferencia.areasInteres.join(", ") },
              { etiqueta: "Tipos de puesto", valor: preferencia.tiposPuesto.join(", ") },
            ]}
          />
        ) : (
          <EmptyState mensaje="Todavía no indicaste tus preferencias." />
        )
      }
      formulario={(acciones) => <FormularioPreferencias preferencia={preferencia} {...acciones} />}
    />
  );
}

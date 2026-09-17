"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { idiomas } from "@/lib/api/idiomas";
import { ETIQUETA_NIVEL_IDIOMA, opcionesDe } from "@/lib/etiquetas";
import { useFormulario } from "@/lib/formulario/use-formulario";
import type { Idioma } from "@/types/perfil";
import { esquemaIdioma } from "./esquemas";
import { FormularioItem } from "./formulario-item";
import { ListaEditable, type PropsFormularioItem } from "./lista-editable";

function FormularioIdioma({ inicial, onListo, onCancelar }: PropsFormularioItem<Idioma>) {
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaIdioma,
    async (datos) => {
      if (inicial) await idiomas.actualizar(inicial.id, datos);
      else await idiomas.crear(datos);
      onListo();
    },
  );

  return (
    <FormularioItem {...{ onSubmit, enviando, errorGeneral, onCancelar }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Idioma" error={errores.idioma}>
          {(c) => <Input {...c} name="idioma" defaultValue={inicial?.idioma} />}
        </Field>
        <Field label="Nivel" error={errores.nivel}>
          {(c) => (
            <Select
              {...c}
              name="nivel"
              defaultValue={inicial?.nivel ?? ""}
              placeholder="Elegí el nivel"
              opciones={opcionesDe(ETIQUETA_NIVEL_IDIOMA)}
            />
          )}
        </Field>
      </div>
    </FormularioItem>
  );
}

function mostrarIdioma(i: Idioma) {
  return (
    <p className="text-sm text-tinta">
      <span className="font-medium">{i.idioma}</span>
      <span className="text-tinta-suave"> · {ETIQUETA_NIVEL_IDIOMA[i.nivel]}</span>
    </p>
  );
}

export function IdiomasSeccion({ items }: { items: Idioma[] }) {
  return (
    <ListaEditable
      titulo="Idiomas"
      textoVacio="Todavía no cargaste idiomas."
      textoAgregar="Agregar idioma"
      items={items}
      mostrar={mostrarIdioma}
      Formulario={FormularioIdioma}
      eliminar={idiomas.eliminar}
    />
  );
}

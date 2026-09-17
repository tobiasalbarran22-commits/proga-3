"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { experiencias } from "@/lib/api/experiencia";
import { formatearFecha } from "@/lib/etiquetas";
import { useFormulario } from "@/lib/formulario/use-formulario";
import type { Experiencia } from "@/types/perfil";
import { esquemaExperiencia } from "./esquemas";
import { FormularioItem } from "./formulario-item";
import { ListaEditable, type PropsFormularioItem } from "./lista-editable";

function FormularioExperiencia({ inicial, onListo, onCancelar }: PropsFormularioItem<Experiencia>) {
  // Este sí es controlado: la fecha de fin se deshabilita si es el trabajo actual.
  const [esActual, setEsActual] = useState(inicial?.esActual ?? false);
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaExperiencia,
    async (datos) => {
      if (inicial) await experiencias.actualizar(inicial.id, datos);
      else await experiencias.crear(datos);
      onListo();
    },
  );

  return (
    <FormularioItem {...{ onSubmit, enviando, errorGeneral, onCancelar }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Empresa" error={errores.empresaNombre}>
          {(c) => <Input {...c} name="empresaNombre" defaultValue={inicial?.empresaNombre} />}
        </Field>
        <Field label="Puesto" error={errores.puesto}>
          {(c) => <Input {...c} name="puesto" defaultValue={inicial?.puesto} />}
        </Field>
        <Field label="Desde" error={errores.fechaInicio}>
          {(c) => (
            <Input {...c} type="date" name="fechaInicio" defaultValue={inicial?.fechaInicio} />
          )}
        </Field>
        <Field label="Hasta" error={errores.fechaFin}>
          {(c) => (
            <Input
              {...c}
              type="date"
              name="fechaFin"
              disabled={esActual}
              defaultValue={inicial?.fechaFin ?? ""}
            />
          )}
        </Field>
      </div>
      <Checkbox name="esActual" checked={esActual} onChange={(e) => setEsActual(e.target.checked)}>
        Es mi trabajo actual
      </Checkbox>
      <Field label="Qué hacías" opcional error={errores.descripcion}>
        {(c) => (
          <Textarea {...c} name="descripcion" rows={3} defaultValue={inicial?.descripcion ?? ""} />
        )}
      </Field>
    </FormularioItem>
  );
}

function mostrarExperiencia(e: Experiencia) {
  return (
    <>
      <p className="font-medium text-tinta">{e.puesto}</p>
      <p className="text-sm text-tinta-suave">{e.empresaNombre}</p>
      <p className="mt-1 text-xs text-tinta-tenue">
        {formatearFecha(e.fechaInicio)} –{" "}
        {e.esActual || !e.fechaFin ? "actualidad" : formatearFecha(e.fechaFin)}
      </p>
      {e.descripcion && <p className="mt-2 text-sm text-tinta-suave">{e.descripcion}</p>}
    </>
  );
}

export function ExperienciaSeccion({ items }: { items: Experiencia[] }) {
  return (
    <ListaEditable
      titulo="Experiencia laboral"
      textoVacio="Todavía no cargaste experiencia laboral."
      textoAgregar="Agregar experiencia"
      items={items}
      mostrar={mostrarExperiencia}
      Formulario={FormularioExperiencia}
      eliminar={experiencias.eliminar}
    />
  );
}

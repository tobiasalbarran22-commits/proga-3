"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { educaciones } from "@/lib/api/educacion";
import {
  ETIQUETA_ESTADO_EDUCATIVO,
  ETIQUETA_NIVEL_EDUCATIVO,
  formatearFecha,
  opcionesDe,
} from "@/lib/etiquetas";
import { useFormulario } from "@/lib/formulario/use-formulario";
import type { Educacion } from "@/types/perfil";
import { esquemaEducacion } from "./esquemas";
import { FormularioItem } from "./formulario-item";
import { ListaEditable, type PropsFormularioItem } from "./lista-editable";

function FormularioEducacion({ inicial, onListo, onCancelar }: PropsFormularioItem<Educacion>) {
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaEducacion,
    async (datos) => {
      if (inicial) await educaciones.actualizar(inicial.id, datos);
      else await educaciones.crear(datos);
      onListo();
    },
  );

  return (
    <FormularioItem {...{ onSubmit, enviando, errorGeneral, onCancelar }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Institución" error={errores.institucion}>
          {(c) => <Input {...c} name="institucion" defaultValue={inicial?.institucion} />}
        </Field>
        <Field label="Título o carrera" error={errores.tituloCarrera}>
          {(c) => <Input {...c} name="tituloCarrera" defaultValue={inicial?.tituloCarrera} />}
        </Field>
        <Field label="Nivel" error={errores.nivel}>
          {(c) => (
            <Select
              {...c}
              name="nivel"
              defaultValue={inicial?.nivel ?? ""}
              placeholder="Elegí el nivel"
              opciones={opcionesDe(ETIQUETA_NIVEL_EDUCATIVO)}
            />
          )}
        </Field>
        <Field label="Estado" error={errores.estado}>
          {(c) => (
            <Select
              {...c}
              name="estado"
              defaultValue={inicial?.estado ?? ""}
              placeholder="Elegí el estado"
              opciones={opcionesDe(ETIQUETA_ESTADO_EDUCATIVO)}
            />
          )}
        </Field>
        <Field label="Desde" error={errores.fechaInicio}>
          {(c) => (
            <Input {...c} type="date" name="fechaInicio" defaultValue={inicial?.fechaInicio} />
          )}
        </Field>
        <Field
          label="Hasta"
          opcional
          ayuda="Dejalo vacío si todavía cursás."
          error={errores.fechaFin}
        >
          {(c) => (
            <Input {...c} type="date" name="fechaFin" defaultValue={inicial?.fechaFin ?? ""} />
          )}
        </Field>
      </div>
    </FormularioItem>
  );
}

function mostrarEducacion(e: Educacion) {
  return (
    <>
      <p className="font-medium text-tinta">{e.tituloCarrera}</p>
      <p className="text-sm text-tinta-suave">{e.institucion}</p>
      <p className="mt-1 text-xs text-tinta-tenue">
        {ETIQUETA_NIVEL_EDUCATIVO[e.nivel]} · {ETIQUETA_ESTADO_EDUCATIVO[e.estado]} ·{" "}
        {formatearFecha(e.fechaInicio)} – {e.fechaFin ? formatearFecha(e.fechaFin) : "actualidad"}
      </p>
    </>
  );
}

export function EducacionSeccion({ items }: { items: Educacion[] }) {
  return (
    <ListaEditable
      titulo="Educación"
      textoVacio="Todavía no cargaste estudios."
      textoAgregar="Agregar estudio"
      items={items}
      mostrar={mostrarEducacion}
      Formulario={FormularioEducacion}
      eliminar={educaciones.eliminar}
    />
  );
}

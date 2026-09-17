import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Checkbox } from "@/components/ui/checkbox";
import { DataList } from "@/components/ui/data-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { rutas } from "@/lib/rutas";
import { DemosInteractivos } from "./demos-interactivos";

export const metadata: Metadata = { title: "Componentes", robots: { index: false } };

/**
 * Muestra de todos los componentes base en sus distintos estados.
 * Sirve para revisar un cambio de estilo en un solo lugar y para saber
 * qué existe antes de crear algo nuevo. En producción no existe (404).
 */

/** Los colores de app/globals.css. Las clases van completas para que Tailwind las detecte. */
const COLORES = [
  { nombre: "bordo", clase: "bg-bordo" },
  { nombre: "bordo-oscuro", clase: "bg-bordo-oscuro" },
  { nombre: "bordo-claro", clase: "bg-bordo-claro" },
  { nombre: "tinta", clase: "bg-tinta" },
  { nombre: "tinta-suave", clase: "bg-tinta-suave" },
  { nombre: "tinta-tenue", clase: "bg-tinta-tenue" },
  { nombre: "fondo", clase: "bg-fondo" },
  { nombre: "fondo-suave", clase: "bg-fondo-suave" },
  { nombre: "linea", clase: "bg-linea" },
  { nombre: "linea-fuerte", clase: "bg-linea-fuerte" },
  { nombre: "exito", clase: "bg-exito" },
  { nombre: "error", clase: "bg-error" },
  { nombre: "aviso", clase: "bg-aviso" },
];

const OPCIONES = [
  { valor: "PRESENCIAL", etiqueta: "Presencial" },
  { valor: "REMOTA", etiqueta: "Remota" },
];

function Muestra({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Panel titulo={titulo}>
      <div className="flex flex-col gap-4">{children}</div>
    </Panel>
  );
}

export default function MuestraUi() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold text-tinta">Componentes base</h1>
        <p className="mt-2 text-tinta-suave">
          Todo lo que está en <code>components/ui</code>. Antes de crear un componente nuevo, revisá
          si ya existe acá.
        </p>
      </div>

      <Muestra titulo="Colores">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLORES.map((color) => (
            <li key={color.nombre} className="flex items-center gap-2 text-sm">
              <span className={`size-8 rounded-md border border-linea ${color.clase}`} />
              {color.nombre}
            </li>
          ))}
        </ul>
      </Muestra>

      <Muestra titulo="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variante="secundario">Secundario</Button>
          <Button variante="peligro">Peligro</Button>
          <Button variante="enlace">Enlace</Button>
          <Button disabled>Deshabilitado</Button>
          <Button cargando>Guardando</Button>
          <Button tamano="sm">Chico</Button>
          <ButtonLink href={rutas.login} variante="secundario">
            Link con forma de botón
          </ButtonLink>
        </div>
      </Muestra>

      <Muestra titulo="Campos">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" ayuda="Texto de ayuda debajo del campo.">
            {(c) => <Input {...c} type="email" placeholder="nombre@ejemplo.com" />}
          </Field>
          <Field label="Con error" error="Ingresá un email válido.">
            {(c) => <Input {...c} defaultValue="no-es-un-email" />}
          </Field>
          <Field label="Modalidad" opcional>
            {(c) => <Select {...c} opciones={OPCIONES} placeholder="Elegí una opción" />}
          </Field>
          <Field label="Deshabilitado">{(c) => <Input {...c} disabled value="Sin editar" />}</Field>
        </div>
        <Field label="Resumen">{(c) => <Textarea {...c} placeholder="Contá sobre vos…" />}</Field>
        <Checkbox name="acepto">Acepto los términos</Checkbox>
        <Checkbox name="con-error" error="Tenés que aceptar para continuar.">
          Casilla con error
        </Checkbox>
      </Muestra>

      <Muestra titulo="Mensajes y etiquetas">
        <Alert tipo="error">No pudimos guardar los cambios. Probá de nuevo.</Alert>
        <Alert tipo="exito">Cambios guardados.</Alert>
        <Alert tipo="aviso">Tu perfil todavía no es visible para las empresas.</Alert>
        <div className="flex flex-wrap gap-2">
          <Badge>Neutro</Badge>
          <Badge tono="marca">Marca</Badge>
          <Badge tono="exito">Éxito</Badge>
          <Badge tono="aviso">Aviso</Badge>
        </div>
      </Muestra>

      <Muestra titulo="Datos y estados">
        <DataList
          datos={[
            { etiqueta: "Nombre", valor: "Ana Pérez" },
            { etiqueta: "Provincia", valor: "Córdoba" },
          ]}
        />
        <EmptyState
          mensaje="Todavía no cargaste ninguna experiencia."
          accion={<Button variante="secundario">Agregar experiencia</Button>}
        />
        <div className="flex items-center gap-2 text-bordo">
          <Spinner className="size-6" />
          <span className="text-sm text-tinta-suave">Spinner</span>
        </div>
      </Muestra>

      <Muestra titulo="Interactivos">
        <DemosInteractivos />
      </Muestra>
    </main>
  );
}

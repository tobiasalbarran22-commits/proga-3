"use client";

import { CamposUbicacion } from "@/components/compartidos/campos-ubicacion";
import { Badge } from "@/components/ui/badge";
import { DataList } from "@/components/ui/data-list";
import { EnlaceExterno } from "@/components/ui/enlace-externo";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { actualizarMiPerfilEmpresa } from "@/lib/api/perfil-empresa";
import { formatearUbicacion } from "@/lib/etiquetas";
import { useFormulario } from "@/lib/formulario/use-formulario";
import type { PerfilEmpresa } from "@/types/perfil";
import type { Pais } from "@/types/usuario";
import { esquemaPerfilEmpresa } from "./esquemas";
import { SeccionEditable, type PropsFormularioSeccion } from "./seccion-editable";

type Props = { perfil: PerfilEmpresa; paises: Pais[] };

function formatearCuit(cuit: string) {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

function Vista({ perfil, paises }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {perfil.verificadaArca && (
        <div>
          <Badge tono="exito">Verificada en ARCA</Badge>
        </div>
      )}
      <DataList
        datos={[
          { etiqueta: "Razón social", valor: perfil.razonSocial },
          { etiqueta: "CUIT", valor: formatearCuit(perfil.identificacionFiscal) },
          { etiqueta: "Nombre comercial", valor: perfil.nombreComercial },
          { etiqueta: "Rubro", valor: perfil.rubro },
          { etiqueta: "Ubicación", valor: formatearUbicacion(perfil, paises) },
          { etiqueta: "Sitio web", valor: <EnlaceExterno url={perfil.sitioWeb} /> },
          { etiqueta: "Logo", valor: <EnlaceExterno url={perfil.logoUrl} /> },
        ]}
      />
      <div>
        <h3 className="text-xs font-medium text-tinta-tenue">Descripción</h3>
        <p className="mt-1 text-sm whitespace-pre-line text-tinta">{perfil.descripcion}</p>
      </div>
    </div>
  );
}

function Formulario({ perfil, paises, onListo, onCancelar }: Props & PropsFormularioSeccion) {
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaPerfilEmpresa,
    async (datos) => {
      await actualizarMiPerfilEmpresa(datos);
      onListo();
    },
  );

  return (
    <Form {...{ onSubmit, enviando, errorGeneral, onCancelar }}>
      <p className="text-sm text-tinta-suave">
        La razón social y el CUIT no se pueden cambiar desde acá.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre comercial" error={errores.nombreComercial}>
          {(c) => <Input {...c} name="nombreComercial" defaultValue={perfil.nombreComercial} />}
        </Field>
        <Field label="Rubro" error={errores.rubro}>
          {(c) => <Input {...c} name="rubro" defaultValue={perfil.rubro} />}
        </Field>
      </div>
      <Field label="Descripción" error={errores.descripcion}>
        {(c) => <Textarea {...c} name="descripcion" defaultValue={perfil.descripcion} />}
      </Field>
      <CamposUbicacion paises={paises} errores={errores} inicial={perfil} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sitio web" opcional error={errores.sitioWeb}>
          {(c) => <Input {...c} name="sitioWeb" type="url" defaultValue={perfil.sitioWeb ?? ""} />}
        </Field>
        <Field
          label="Enlace al logo"
          opcional
          ayuda="Por ahora se carga como enlace a una imagen."
          error={errores.logoUrl}
        >
          {(c) => <Input {...c} name="logoUrl" type="url" defaultValue={perfil.logoUrl ?? ""} />}
        </Field>
      </div>
    </Form>
  );
}

export function PerfilEmpresaSeccion({ perfil, paises }: Props) {
  return (
    <SeccionEditable
      titulo="Datos de la empresa"
      vista={<Vista perfil={perfil} paises={paises} />}
      formulario={(acciones) => <Formulario perfil={perfil} paises={paises} {...acciones} />}
    />
  );
}

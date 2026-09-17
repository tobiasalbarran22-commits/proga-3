"use client";

import { CamposUbicacion } from "@/components/compartidos/campos-ubicacion";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { actualizarMiPerfilTrabajador, crearPerfilTrabajador } from "@/lib/api/perfil-trabajador";
import { ETIQUETA_NIVEL_EXPERIENCIA, ETIQUETA_TIPO_DOCUMENTO, opcionesDe } from "@/lib/etiquetas";
import { useFormulario } from "@/lib/formulario/use-formulario";
import type { PerfilTrabajador } from "@/types/perfil";
import type { Pais } from "@/types/usuario";
import { esquemaPerfilTrabajador } from "./esquemas";
import type { PropsFormularioSeccion } from "./seccion-editable";

type Props = PropsFormularioSeccion & { perfil: PerfilTrabajador | null; paises: Pais[] };

/** Crea el perfil si todavía no existe, o lo actualiza si ya existe. */
export function FormularioPerfilTrabajador({ perfil, paises, onListo, onCancelar }: Props) {
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaPerfilTrabajador,
    async (datos) => {
      if (perfil) await actualizarMiPerfilTrabajador(datos);
      else await crearPerfilTrabajador(datos);
      onListo();
    },
  );

  return (
    <Form
      {...{ onSubmit, enviando, errorGeneral, onCancelar }}
      textoGuardar={perfil ? "Guardar cambios" : "Crear perfil"}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={errores.nombre}>
          {(c) => <Input {...c} name="nombre" defaultValue={perfil?.nombre} />}
        </Field>
        <Field label="Apellido" error={errores.apellido}>
          {(c) => <Input {...c} name="apellido" defaultValue={perfil?.apellido} />}
        </Field>
        <Field label="Tipo de documento" error={errores.tipoDocumento}>
          {(c) => (
            <Select
              {...c}
              name="tipoDocumento"
              defaultValue={perfil?.tipoDocumento ?? "DNI"}
              opciones={opcionesDe(ETIQUETA_TIPO_DOCUMENTO)}
            />
          )}
        </Field>
        <Field label="Número de documento" error={errores.numeroDocumento}>
          {(c) => <Input {...c} name="numeroDocumento" defaultValue={perfil?.numeroDocumento} />}
        </Field>
        <Field label="Fecha de nacimiento" error={errores.fechaNacimiento}>
          {(c) => (
            <Input
              {...c}
              type="date"
              name="fechaNacimiento"
              defaultValue={perfil?.fechaNacimiento ?? ""}
            />
          )}
        </Field>
        <Field label="Título profesional" opcional error={errores.tituloProfesional}>
          {(c) => (
            <Input
              {...c}
              name="tituloProfesional"
              placeholder="Por ejemplo: desarrolladora frontend"
              defaultValue={perfil?.tituloProfesional ?? ""}
            />
          )}
        </Field>
      </div>

      <CamposUbicacion paises={paises} errores={errores} inicial={perfil ?? undefined} />

      <Field label="Resumen profesional" opcional error={errores.resumenProfesional}>
        {(c) => (
          <Textarea
            {...c}
            name="resumenProfesional"
            placeholder="Contá en pocas líneas quién sos y qué buscás."
            defaultValue={perfil?.resumenProfesional ?? ""}
          />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nivel de experiencia" opcional error={errores.nivelExperiencia}>
          {(c) => (
            <Select
              {...c}
              name="nivelExperiencia"
              defaultValue={perfil?.nivelExperiencia ?? ""}
              placeholder="Sin especificar"
              opciones={opcionesDe(ETIQUETA_NIVEL_EXPERIENCIA)}
            />
          )}
        </Field>
        <Field label="Años de experiencia" opcional error={errores.aniosExperiencia}>
          {(c) => (
            <Input
              {...c}
              name="aniosExperiencia"
              type="number"
              min={0}
              max={60}
              defaultValue={perfil?.aniosExperiencia ?? ""}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Enlace al CV" opcional error={errores.cvUrl}>
          {(c) => <Input {...c} name="cvUrl" type="url" defaultValue={perfil?.cvUrl ?? ""} />}
        </Field>
        <Field label="LinkedIn" opcional error={errores.linkedinUrl}>
          {(c) => (
            <Input {...c} name="linkedinUrl" type="url" defaultValue={perfil?.linkedinUrl ?? ""} />
          )}
        </Field>
        <Field label="Portfolio" opcional error={errores.portfolioUrl}>
          {(c) => (
            <Input
              {...c}
              name="portfolioUrl"
              type="url"
              defaultValue={perfil?.portfolioUrl ?? ""}
            />
          )}
        </Field>
      </div>

      <Checkbox name="perfilVisible" defaultChecked={perfil?.perfilVisible ?? true}>
        Mostrar mi perfil a las empresas
      </Checkbox>
    </Form>
  );
}

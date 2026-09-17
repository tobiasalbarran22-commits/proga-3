"use client";

import { useRouter } from "next/navigation";
import { CamposUbicacion } from "@/components/compartidos/campos-ubicacion";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { iniciarSesion, registrarEmpresa } from "@/lib/api/auth";
import { vincularErrores } from "@/lib/formulario/errores";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { rutas } from "@/lib/rutas";
import type { Pais } from "@/types/usuario";
import { CampoTerminos } from "./campo-terminos";
import { CamposContrasena } from "./campos-contrasena";
import { esquemaRegistroEmpresa } from "./esquemas";

export function RegistroEmpresaForm({ paises }: { paises: Pais[] }) {
  const router = useRouter();
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaRegistroEmpresa,
    async (datos) => {
      try {
        await registrarEmpresa(datos);
      } catch (error) {
        vincularErrores(error, {
          EMAIL_REGISTRADO: "email",
          CUIT_REGISTRADO: "identificacionFiscal",
        });
      }
      await iniciarSesion(datos.email, datos.contrasena);
      router.replace(rutas.verificarCuenta);
      router.refresh();
    },
  );

  return (
    <Form
      onSubmit={onSubmit}
      enviando={enviando}
      errorGeneral={errorGeneral}
      textoGuardar="Crear cuenta de empresa"
    >
      <Field label="Razón social" error={errores.razonSocial}>
        {(control) => <Input {...control} name="razonSocial" autoComplete="organization" />}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CUIT" error={errores.identificacionFiscal} ayuda="Con o sin guiones.">
          {(control) => (
            <Input
              {...control}
              name="identificacionFiscal"
              inputMode="numeric"
              maxLength={13}
              placeholder="30-12345678-9"
            />
          )}
        </Field>
        <Field label="Nombre comercial" error={errores.nombreComercial}>
          {(control) => <Input {...control} name="nombreComercial" />}
        </Field>
      </div>

      <Field label="Rubro" error={errores.rubro}>
        {(control) => (
          <Input {...control} name="rubro" placeholder="Por ejemplo: desarrollo de software" />
        )}
      </Field>

      <Field label="Descripción de la empresa" error={errores.descripcion}>
        {(control) => <Textarea {...control} name="descripcion" rows={3} />}
      </Field>

      <CamposUbicacion paises={paises} errores={errores} />

      <Field label="Email de la cuenta" error={errores.email}>
        {(control) => <Input {...control} name="email" type="email" autoComplete="email" />}
      </Field>

      <CamposContrasena errores={errores} />
      <CampoTerminos error={errores.aceptaTerminos} />
    </Form>
  );
}

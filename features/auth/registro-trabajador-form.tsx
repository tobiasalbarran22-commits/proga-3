"use client";

import { useRouter } from "next/navigation";
import { CamposUbicacion } from "@/components/compartidos/campos-ubicacion";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { iniciarSesion, registrarTrabajador } from "@/lib/api/auth";
import { crearPerfilTrabajador } from "@/lib/api/perfil-trabajador";
import { vincularErrores } from "@/lib/formulario/errores";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { rutas } from "@/lib/rutas";
import type { Pais } from "@/types/usuario";
import { CampoTerminos } from "./campo-terminos";
import { CamposContrasena } from "./campos-contrasena";
import { esquemaRegistroTrabajador, type DatosRegistroTrabajador } from "./esquemas";

/**
 * Registrar un trabajador son tres pasos en el backend:
 * crear la cuenta, iniciar sesión y crear el perfil.
 * Si el tercero falla, la cuenta ya existe: la persona puede iniciar sesión
 * y completar el perfil desde /perfil.
 */
async function registrar(datos: DatosRegistroTrabajador) {
  try {
    await registrarTrabajador(datos.email, datos.contrasena);
  } catch (error) {
    vincularErrores(error, { EMAIL_REGISTRADO: "email" });
  }
  await iniciarSesion(datos.email, datos.contrasena);
  await crearPerfilTrabajador({
    nombre: datos.nombre,
    apellido: datos.apellido,
    tipoDocumento: "DNI",
    numeroDocumento: datos.dni,
    fechaNacimiento: datos.fechaNacimiento,
    paisCodigo: datos.paisCodigo,
    provincia: datos.provincia,
    ciudad: datos.ciudad,
    tituloProfesional: null,
    resumenProfesional: null,
    nivelExperiencia: null,
    aniosExperiencia: null,
    cvUrl: null,
    linkedinUrl: null,
    portfolioUrl: null,
    perfilVisible: true,
  });
}

export function RegistroTrabajadorForm({ paises }: { paises: Pais[] }) {
  const router = useRouter();
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaRegistroTrabajador,
    async (datos) => {
      await registrar(datos);
      router.replace(rutas.verificarCuenta);
      router.refresh();
    },
  );

  return (
    <Form
      onSubmit={onSubmit}
      enviando={enviando}
      errorGeneral={errorGeneral}
      textoGuardar="Crear cuenta"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={errores.nombre}>
          {(control) => <Input {...control} name="nombre" autoComplete="given-name" />}
        </Field>
        <Field label="Apellido" error={errores.apellido}>
          {(control) => <Input {...control} name="apellido" autoComplete="family-name" />}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="DNI" error={errores.dni} ayuda="Sin puntos.">
          {(control) => <Input {...control} name="dni" inputMode="numeric" maxLength={8} />}
        </Field>
        <Field label="Fecha de nacimiento" error={errores.fechaNacimiento}>
          {(control) => (
            <Input {...control} name="fechaNacimiento" type="date" autoComplete="bday" />
          )}
        </Field>
      </div>

      <CamposUbicacion paises={paises} errores={errores} />

      <Field label="Email" error={errores.email}>
        {(control) => <Input {...control} name="email" type="email" autoComplete="email" />}
      </Field>

      <CamposContrasena errores={errores} />
      <CampoTerminos error={errores.aceptaTerminos} />
    </Form>
  );
}

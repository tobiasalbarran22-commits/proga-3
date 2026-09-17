"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { iniciarSesion } from "@/lib/api/auth";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { rutas } from "@/lib/rutas";
import { esquemaLogin } from "./esquemas";

export function LoginForm() {
  const router = useRouter();
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaLogin,
    async ({ email, contrasena }) => {
      await iniciarSesion(email, contrasena);
      // La página de inicio decide a dónde va cada rol (ver app/page.tsx).
      router.replace(rutas.inicio);
      router.refresh();
    },
  );

  return (
    <Form
      onSubmit={onSubmit}
      enviando={enviando}
      errorGeneral={errorGeneral}
      textoGuardar="Iniciar sesión"
    >
      <Field label="Email" error={errores.email}>
        {(control) => <Input {...control} name="email" type="email" autoComplete="email" />}
      </Field>

      <Field label="Contraseña" error={errores.contrasena}>
        {(control) => (
          <Input {...control} name="contrasena" type="password" autoComplete="current-password" />
        )}
      </Field>

      <Link
        href={rutas.recuperarContrasena}
        className="-mt-1 self-end text-sm font-medium text-bordo hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </Form>
  );
}

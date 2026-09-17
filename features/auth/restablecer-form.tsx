"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Form } from "@/components/ui/form";
import { restablecerContrasena } from "@/lib/api/auth";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { rutas } from "@/lib/rutas";
import { CamposContrasena } from "./campos-contrasena";
import { esquemaRestablecer } from "./esquemas";

export function RestablecerForm({ token }: { token: string }) {
  const [listo, setListo] = useState(false);
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaRestablecer,
    async ({ contrasena }) => {
      await restablecerContrasena(token, contrasena);
      setListo(true);
    },
  );

  if (listo) {
    return (
      <div className="flex flex-col gap-4">
        <Alert tipo="exito">Listo, tu contraseña se actualizó.</Alert>
        <ButtonLink href={rutas.login}>Iniciar sesión</ButtonLink>
      </div>
    );
  }

  return (
    <Form
      onSubmit={onSubmit}
      enviando={enviando}
      errorGeneral={errorGeneral}
      textoGuardar="Guardar contraseña nueva"
    >
      <CamposContrasena errores={errores} />
    </Form>
  );
}

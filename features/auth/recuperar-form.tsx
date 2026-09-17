"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pedirRecuperacion } from "@/lib/api/auth";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { esquemaRecuperar } from "./esquemas";

export function RecuperarForm() {
  const [enviado, setEnviado] = useState(false);
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaRecuperar,
    async ({ email }) => {
      await pedirRecuperacion(email);
      setEnviado(true);
    },
  );

  if (enviado) {
    // El mensaje es el mismo exista o no la cuenta, para no revelar qué emails están registrados.
    return (
      <Alert tipo="exito">
        Si hay una cuenta con ese email, te enviamos un enlace para elegir una contraseña nueva.
        Revisá también la carpeta de spam.
      </Alert>
    );
  }

  return (
    <Form
      onSubmit={onSubmit}
      enviando={enviando}
      errorGeneral={errorGeneral}
      textoGuardar="Enviar enlace"
    >
      <Field label="Email" error={errores.email}>
        {(control) => <Input {...control} name="email" type="email" autoComplete="email" />}
      </Field>
    </Form>
  );
}

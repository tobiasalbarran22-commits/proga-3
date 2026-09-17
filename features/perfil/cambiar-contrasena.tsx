"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cambiarContrasena } from "@/lib/api/usuarios";
import { vincularErrores } from "@/lib/formulario/errores";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { esquemaCambioContrasena } from "./esquemas";

/** Botón que despliega el formulario para cambiar la contraseña. */
export function CambiarContrasena() {
  const [abierto, setAbierto] = useState(false);
  const [listo, setListo] = useState(false);
  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaCambioContrasena,
    async ({ actual, contrasena }) => {
      try {
        await cambiarContrasena(actual, contrasena);
      } catch (error) {
        vincularErrores(error, { CONTRASENA_INCORRECTA: "actual" });
      }
      setAbierto(false);
      setListo(true);
    },
  );

  if (!abierto) {
    return (
      <div className="flex flex-col items-start gap-3">
        {listo && <Alert tipo="exito">Tu contraseña se actualizó.</Alert>}
        <Button variante="secundario" onClick={() => setAbierto(true)}>
          Cambiar contraseña
        </Button>
      </div>
    );
  }

  return (
    <Form
      {...{ onSubmit, enviando, errorGeneral }}
      onCancelar={() => setAbierto(false)}
      textoGuardar="Actualizar contraseña"
    >
      <Field label="Contraseña actual" error={errores.actual}>
        {(c) => <Input {...c} name="actual" type="password" autoComplete="current-password" />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contraseña nueva" error={errores.contrasena}>
          {(c) => <Input {...c} name="contrasena" type="password" autoComplete="new-password" />}
        </Field>
        <Field label="Repetí la contraseña nueva" error={errores.confirmacion}>
          {(c) => <Input {...c} name="confirmacion" type="password" autoComplete="new-password" />}
        </Field>
      </div>
    </Form>
  );
}

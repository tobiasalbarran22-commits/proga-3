"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { reenviarCodigo, verificarEmail } from "@/lib/api/auth";
import { mensajeParaUsuario } from "@/lib/api/errores";
import { vincularErrores } from "@/lib/formulario/errores";
import { useFormulario } from "@/lib/formulario/use-formulario";
import { rutas } from "@/lib/rutas";
import { esquemaCodigo } from "./esquemas";

/**
 * Un solo campo para los 6 números (en lugar de 6 casillas): se puede pegar
 * el código entero, el celular lo sugiere solo (one-time-code) y un lector
 * de pantalla lo anuncia como un único campo.
 */
export function VerificarCuentaForm() {
  const router = useRouter();
  const [reenvio, setReenvio] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [reenviando, setReenviando] = useState(false);

  const { onSubmit, errores, errorGeneral, enviando } = useFormulario(
    esquemaCodigo,
    async ({ codigo }) => {
      try {
        await verificarEmail(codigo);
      } catch (error) {
        vincularErrores(error, { CODIGO_INVALIDO: "codigo" });
      }
      router.replace(rutas.inicio);
      router.refresh();
    },
  );

  async function reenviar() {
    setReenviando(true);
    setReenvio(null);
    try {
      await reenviarCodigo();
      setReenvio({ tipo: "exito", texto: "Te enviamos un código nuevo." });
    } catch (error) {
      setReenvio({ tipo: "error", texto: mensajeParaUsuario(error) });
    } finally {
      setReenviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Form
        onSubmit={onSubmit}
        enviando={enviando}
        errorGeneral={errorGeneral}
        textoGuardar="Verificar cuenta"
      >
        <Field label="Código de verificación" error={errores.codigo}>
          {(control) => (
            <Input
              {...control}
              name="codigo"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="text-center font-mono text-2xl tracking-[0.5em]"
            />
          )}
        </Field>
      </Form>

      {reenvio && <Alert tipo={reenvio.tipo}>{reenvio.texto}</Alert>}
      <Button variante="enlace" className="self-center" onClick={reenviar} disabled={reenviando}>
        ¿No te llegó? Enviar otro código
      </Button>
    </div>
  );
}

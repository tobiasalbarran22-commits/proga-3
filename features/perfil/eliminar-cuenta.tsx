"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { mensajeParaUsuario } from "@/lib/api/errores";
import { eliminarMiCuenta } from "@/lib/api/usuarios";
import { rutas } from "@/lib/rutas";

/** Baja de la cuenta. Siempre pide confirmación antes de borrar. */
export function EliminarCuenta() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function eliminar() {
    setError(null);
    try {
      await eliminarMiCuenta();
      router.replace(rutas.login);
      router.refresh();
    } catch (e) {
      setError(mensajeParaUsuario(e));
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-linea pt-5">
      <div>
        <h3 className="font-medium text-tinta">Eliminar cuenta</h3>
        <p className="text-sm text-tinta-suave">
          Se da de baja tu cuenta y dejás de aparecer en las búsquedas.
        </p>
      </div>
      {error && <Alert tipo="error">{error}</Alert>}
      <ConfirmButton
        pregunta="¿Seguro que querés eliminar tu cuenta?"
        textoConfirmar="Sí, eliminar mi cuenta"
        onConfirmar={eliminar}
      >
        Eliminar mi cuenta
      </ConfirmButton>
    </div>
  );
}

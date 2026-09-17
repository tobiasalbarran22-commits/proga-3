import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/layout/auth-card";
import { AuthEncabezado } from "@/components/layout/auth-encabezado";
import { BotonSalir } from "@/features/auth/boton-salir";
import { VerificarCuentaForm } from "@/features/auth/verificar-cuenta-form";
import { destinoInicial, exigirSesion } from "@/lib/sesion";

export const metadata: Metadata = { title: "Verificar cuenta" };

/**
 * Está fuera de los grupos (auth) y (app) porque necesita sesión
 * pero NO necesita el email verificado.
 */
export default async function VerificarCuenta() {
  const usuario = await exigirSesion();
  if (usuario.emailVerificado) redirect(destinoInicial(usuario));

  return (
    <AuthCard>
      <AuthEncabezado
        titulo="Verificá tu email"
        bajada={`Te enviamos un código de 6 números a ${usuario.email}.`}
      />
      <VerificarCuentaForm />
      <div className="mt-6 flex justify-center border-t border-linea pt-4">
        <BotonSalir texto="Usar otra cuenta" />
      </div>
    </AuthCard>
  );
}

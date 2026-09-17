import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { AuthEncabezado } from "@/components/layout/auth-encabezado";
import { ButtonLink } from "@/components/ui/button-link";
import { RestablecerForm } from "@/features/auth/restablecer-form";
import { rutas } from "@/lib/rutas";

export const metadata: Metadata = { title: "Elegir contraseña nueva" };

type Props = { searchParams: Promise<{ token?: string | string[] }> };

/** A esta pantalla se llega desde el enlace del mail: /restablecer-contrasena?token=… */
export default async function RestablecerContrasena({ searchParams }: Props) {
  const { token } = await searchParams;

  if (typeof token !== "string" || token === "") {
    return (
      <>
        <AuthEncabezado titulo="Enlace inválido" />
        <div className="flex flex-col gap-4">
          <Alert tipo="error">Este enlace no es válido. Pedí uno nuevo.</Alert>
          <ButtonLink href={rutas.recuperarContrasena}>Pedir otro enlace</ButtonLink>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthEncabezado titulo="Elegí tu contraseña nueva" />
      <RestablecerForm token={token} />
    </>
  );
}

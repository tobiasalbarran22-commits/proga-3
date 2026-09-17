import type { Metadata } from "next";
import { AuthEncabezado } from "@/components/layout/auth-encabezado";
import { AuthFooterLink } from "@/components/layout/auth-footer-link";
import { RecuperarForm } from "@/features/auth/recuperar-form";
import { rutas } from "@/lib/rutas";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecuperarContrasena() {
  return (
    <>
      <AuthEncabezado
        titulo="Recuperar contraseña"
        bajada="Te enviamos un enlace para que elijas una contraseña nueva."
      />
      <RecuperarForm />
      <AuthFooterLink href={rutas.login} enlace="Volver a iniciar sesión" />
    </>
  );
}

import type { Metadata } from "next";
import { AuthEncabezado } from "@/components/layout/auth-encabezado";
import { AuthFooterLink } from "@/components/layout/auth-footer-link";
import { LoginForm } from "@/features/auth/login-form";
import { rutas } from "@/lib/rutas";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function Login() {
  return (
    <>
      <AuthEncabezado titulo="Te damos la bienvenida" bajada="Iniciá sesión para continuar." />
      <LoginForm />
      <AuthFooterLink texto="¿No tenés cuenta? " href={rutas.registro} enlace="Registrate" />
    </>
  );
}

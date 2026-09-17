import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AuthCard } from "@/components/layout/auth-card";
import { destinoInicial, obtenerUsuarioActual } from "@/lib/sesion";

/** Pantallas para quien NO inició sesión. Si ya la inició, no tiene nada que hacer acá. */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  const usuario = await obtenerUsuarioActual();
  if (usuario) redirect(destinoInicial(usuario));

  return <AuthCard>{children}</AuthCard>;
}

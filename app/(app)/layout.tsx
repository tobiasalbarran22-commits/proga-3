import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { BotonSalir } from "@/features/auth/boton-salir";
import { ENLACES_POR_ROL } from "@/lib/navegacion";
import { exigirUsuarioVerificado } from "@/lib/sesion";

/**
 * Pantallas internas. Este layout es el control real de acceso:
 * sin sesión redirige al login y con el email sin verificar, a /verificar-cuenta.
 * Todas las páginas de este grupo pueden dar por hecho que hay un usuario verificado.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const usuario = await exigirUsuarioVerificado();

  return (
    <div className="flex min-h-dvh flex-col bg-fondo-suave">
      <Navbar
        enlaces={ENLACES_POR_ROL[usuario.tipo]}
        nombreUsuario={usuario.email}
        accionSalir={<BotonSalir />}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}

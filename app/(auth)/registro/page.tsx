import type { Metadata } from "next";
import Link from "next/link";
import { AuthEncabezado } from "@/components/layout/auth-encabezado";
import { AuthFooterLink } from "@/components/layout/auth-footer-link";
import { rutas } from "@/lib/rutas";

export const metadata: Metadata = { title: "Crear cuenta" };

const OPCIONES = [
  {
    href: rutas.registroTrabajador,
    titulo: "Busco trabajo",
    texto: "Creá tu perfil y postulate a empleos de tecnología.",
  },
  {
    href: rutas.registroEmpresa,
    titulo: "Busco talento",
    texto: "Registrá tu empresa y publicá búsquedas laborales.",
  },
];

export default function Registro() {
  return (
    <>
      <AuthEncabezado titulo="Crear cuenta" bajada="Elegí cómo vas a usar laburAR." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {OPCIONES.map((opcion) => (
          <li key={opcion.href}>
            <Link
              href={opcion.href}
              className="block h-full rounded-xl border border-linea-fuerte p-4 transition-colors hover:border-bordo hover:bg-bordo-claro"
            >
              <span className="block font-semibold text-tinta">{opcion.titulo}</span>
              <span className="mt-1 block text-sm text-tinta-suave">{opcion.texto}</span>
            </Link>
          </li>
        ))}
      </ul>
      <AuthFooterLink texto="¿Ya tenés cuenta? " href={rutas.login} enlace="Iniciá sesión" />
    </>
  );
}

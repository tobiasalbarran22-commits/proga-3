import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { EnlaceNav } from "@/lib/navegacion";
import { rutas } from "@/lib/rutas";
import { NavLink } from "./nav-link";

type Props = {
  enlaces: EnlaceNav[];
  nombreUsuario: string;
  /** Acción de cerrar sesión: la provee la feature de auth. */
  accionSalir: ReactNode;
};

/**
 * Barra superior de las pantallas internas.
 * En pantallas chicas el menú se abre con <details>: funciona sin JavaScript
 * y es accesible de fábrica.
 */
export function Navbar({ enlaces, nombreUsuario, accionSalir }: Props) {
  const lista = (
    <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
      {enlaces.map((enlace) => (
        <li key={enlace.href}>
          <NavLink href={enlace.href}>{enlace.etiqueta}</NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="border-b border-linea bg-fondo">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={rutas.empleos} className="flex items-center gap-2 rounded-lg">
          <Image src="/logo.png" alt="" width={36} height={36} />
          <span className="text-xl font-bold text-tinta">laburAR</span>
        </Link>

        {/* Escritorio */}
        <nav aria-label="Principal" className="hidden items-center gap-4 md:flex">
          {lista}
          <span className="max-w-48 truncate text-sm text-tinta-suave" title={nombreUsuario}>
            {nombreUsuario}
          </span>
          {accionSalir}
        </nav>

        {/* Móvil */}
        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-linea px-3 py-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Menú</span>
            <span className="hidden group-open:inline">Cerrar</span>
          </summary>
          <nav
            aria-label="Principal"
            className="absolute right-0 z-20 mt-2 flex w-64 flex-col gap-3 rounded-xl border border-linea bg-fondo p-3 shadow-lg"
          >
            <p className="truncate px-3 text-sm text-tinta-suave">{nombreUsuario}</p>
            {lista}
            <div className="border-t border-linea px-3 pt-3">{accionSalir}</div>
          </nav>
        </details>
      </div>
    </header>
  );
}

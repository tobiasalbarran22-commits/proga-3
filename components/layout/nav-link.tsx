"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Enlace del menú que se marca cuando corresponde a la página actual.
 * Es client solo porque necesita saber la ruta actual (usePathname).
 */
export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const activo = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={cn(
        "block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        activo ? "bg-bordo-claro text-bordo" : "text-tinta-suave hover:text-tinta",
      )}
    >
      {children}
    </Link>
  );
}

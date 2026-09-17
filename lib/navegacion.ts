import { rutas } from "@/lib/rutas";
import type { TipoUsuario } from "@/types/enums";

export type EnlaceNav = { href: string; etiqueta: string };

/**
 * Qué enlaces ve cada rol en la barra de navegación.
 * Mostrar u ocultar un enlace es solo comodidad: el permiso real lo
 * controlan exigirRol (en cada página) y el backend.
 */
export const ENLACES_POR_ROL: Record<TipoUsuario, EnlaceNav[]> = {
  TRABAJADOR: [
    { href: rutas.empleos, etiqueta: "Empleos" },
    { href: rutas.postulaciones, etiqueta: "Mis postulaciones" },
    { href: rutas.perfil, etiqueta: "Mi perfil" },
    { href: rutas.planes, etiqueta: "Planes" },
  ],
  EMPRESA: [
    { href: rutas.empleos, etiqueta: "Empleos" },
    { href: rutas.postulaciones, etiqueta: "Postulantes" },
    { href: rutas.perfil, etiqueta: "Mi empresa" },
    { href: rutas.planes, etiqueta: "Planes" },
  ],
  ADMINISTRADOR: [
    { href: rutas.admin, etiqueta: "Administración" },
    { href: rutas.empleos, etiqueta: "Empleos" },
  ],
};

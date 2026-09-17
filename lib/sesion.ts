/**
 * Quién inició sesión, resuelto SIEMPRE en el servidor y consultando al backend.
 *
 * Esta es la única fuente de verdad sobre el usuario: el navegador nunca
 * guarda el rol. Los layouts y las páginas usan estas funciones para decidir
 * qué mostrar y a dónde redirigir.
 */

import "server-only";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { ApiError } from "@/lib/api/errores";
import { obtenerMiUsuario } from "@/lib/api/usuarios";
import { rutas } from "@/lib/rutas";
import type { TipoUsuario } from "@/types/enums";
import type { Usuario } from "@/types/usuario";

/**
 * Devuelve el usuario actual o `null` si no hay sesión.
 * `cache` evita consultar al backend más de una vez por pedido, aunque
 * lo llamen el layout y la página.
 */
export const obtenerUsuarioActual = cache(async (): Promise<Usuario | null> => {
  try {
    return await obtenerMiUsuario();
  } catch (error) {
    if (error instanceof ApiError && error.codigo === "NO_AUTENTICADO") return null;
    throw error;
  }
});

/** Para pantallas que necesitan sesión, aunque el email no esté verificado. */
export async function exigirSesion(): Promise<Usuario> {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) redirect(rutas.login);
  return usuario;
}

/** Para las pantallas de la app: sesión activa y email verificado. */
export async function exigirUsuarioVerificado(): Promise<Usuario> {
  const usuario = await exigirSesion();
  if (!usuario.emailVerificado) redirect(rutas.verificarCuenta);
  return usuario;
}

/**
 * Si el rol no está permitido se muestra un 404, igual que una URL que no
 * existe: así no se confirma que la pantalla existe.
 */
export async function exigirRol(...permitidos: TipoUsuario[]): Promise<Usuario> {
  const usuario = await exigirUsuarioVerificado();
  if (!permitidos.includes(usuario.tipo)) notFound();
  return usuario;
}

/** A dónde mandar a alguien que ya inició sesión. */
export function destinoInicial(usuario: Usuario): string {
  if (!usuario.emailVerificado) return rutas.verificarCuenta;
  return usuario.tipo === "ADMINISTRADOR" ? rutas.admin : rutas.empleos;
}

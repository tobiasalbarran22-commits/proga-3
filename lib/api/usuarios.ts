/**
 * La cuenta del usuario que inició sesión.
 */

import { z } from "zod";
import { ESTADOS_CUENTA, TIPOS_USUARIO } from "@/types/enums";
import type { Usuario } from "@/types/usuario";
import { pedir } from "./cliente";

const esquemaUsuario = z
  .object({
    usuario_id: z.string(),
    email: z.string(),
    tipo_usuario: z.enum(TIPOS_USUARIO),
    estado_cuenta: z.enum(ESTADOS_CUENTA),
    email_verificado: z.boolean(),
  })
  .transform((u): Usuario => ({
    id: u.usuario_id,
    email: u.email,
    tipo: u.tipo_usuario,
    estadoCuenta: u.estado_cuenta,
    emailVerificado: u.email_verificado,
  }));

export async function obtenerMiUsuario(): Promise<Usuario> {
  return esquemaUsuario.parse(await pedir("/users/me"));
}

export async function cambiarContrasena(actual: string, nueva: string): Promise<void> {
  await pedir("/users/me", {
    metodo: "PUT",
    cuerpo: { password_actual: actual, nueva_password: nueva },
  });
}

/** Baja lógica: el backend marca la cuenta como ELIMINADA. */
export async function eliminarMiCuenta(): Promise<void> {
  await pedir("/users/me", { metodo: "DELETE" });
}

/**
 * Reglas de validación reutilizables. Cada formulario arma su esquema
 * combinando estas piezas, así un mismo dato se valida igual en todos lados.
 */

import { z } from "zod";

export const LARGO_MAXIMO_EMAIL = 254;
export const LARGO_MINIMO_CONTRASENA = 8;
export const LARGO_MAXIMO_CONTRASENA = 128;

export const email = z
  .string()
  .trim()
  .min(1, "Ingresá tu email.")
  .max(LARGO_MAXIMO_EMAIL, "El email es demasiado largo.")
  .pipe(z.email("Ingresá un email válido."));

/** Para iniciar sesión: no se validan reglas de formato, solo que no esté vacía. */
export const contrasenaActual = z
  .string()
  .min(1, "Ingresá tu contraseña.")
  .max(LARGO_MAXIMO_CONTRASENA, "La contraseña es demasiado larga.");

export const contrasenaNueva = z
  .string()
  .min(LARGO_MINIMO_CONTRASENA, `Usá al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`)
  .max(LARGO_MAXIMO_CONTRASENA, "La contraseña es demasiado larga.");

export function textoRequerido(mensaje: string, maximo = 120) {
  return z.string().trim().min(1, mensaje).max(maximo, `Usá como máximo ${maximo} caracteres.`);
}

/** Texto opcional: si queda vacío se convierte en `null`. */
export function textoOpcional(maximo = 2000) {
  return z
    .string()
    .trim()
    .max(maximo, `Usá como máximo ${maximo} caracteres.`)
    .transform((valor) => valor || null);
}

/** URL opcional que solo acepta http o https (evita enlaces "javascript:"). */
export const urlOpcional = z
  .string()
  .trim()
  .transform((valor) => valor || null)
  .pipe(
    z
      .url({ protocol: /^https?$/, message: "Ingresá un enlace que empiece con https://" })
      .nullable(),
  );

export function fechaRequerida(mensaje: string) {
  return z.iso.date(mensaje);
}

export const fechaOpcional = z
  .string()
  .transform((valor) => valor || null)
  .pipe(z.iso.date("Ingresá una fecha válida.").nullable());

/** Un checkbox marcado llega como "on"; sin marcar, no llega. */
export const casilla = z
  .string()
  .optional()
  .transform((valor) => valor === "on");

export function opcionDe<const T extends readonly [string, ...string[]]>(
  valores: T,
  mensaje: string,
) {
  return z.enum(valores, mensaje);
}

/** Un <select> con opción vacía: "" se convierte en `null`. */
export function opcionOpcional<const T extends readonly [string, ...string[]]>(valores: T) {
  return z.union([z.literal("").transform(() => null), z.enum(valores)]);
}

export const numeroOpcional = z
  .string()
  .trim()
  .transform((valor) => (valor === "" ? null : Number(valor)))
  .pipe(z.number("Ingresá un número.").int("Ingresá un número entero.").min(0).max(60).nullable());

export const listaDeTextos = z.array(z.string().trim().min(1)).default([]);

export const dni = z
  .string()
  .trim()
  .regex(/^\d{7,8}$/, "Ingresá el DNI sin puntos (7 u 8 números).");

/** CUIT con dígito verificador (algoritmo de módulo 11 de ARCA). */
export const cuit = z
  .string()
  .trim()
  .transform((valor) => valor.replace(/\D/g, ""))
  .refine(esCuitValido, "El CUIT no es válido. Revisá los 11 números.");

export function esCuitValido(cuit: string): boolean {
  if (!/^\d{11}$/.test(cuit)) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((total, peso, i) => total + peso * Number(cuit[i]), 0);
  const resto = 11 - (suma % 11);
  const verificador = resto === 11 ? 0 : resto === 10 ? 9 : resto;
  return verificador === Number(cuit[10]);
}

/** Agrega al esquema la regla "las dos contraseñas coinciden". */
export function conConfirmacion<T extends { contrasena: string; confirmacion: string }>(
  esquema: z.ZodType<T>,
) {
  return esquema.refine((datos) => datos.contrasena === datos.confirmacion, {
    path: ["confirmacion"],
    message: "Las contraseñas no coinciden.",
  });
}

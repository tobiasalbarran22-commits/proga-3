import { z } from "zod";

/**
 * Lee y valida las variables de entorno UNA sola vez.
 * Si falta algo o tiene un formato inválido, la app falla al arrancar con
 * un mensaje claro, en lugar de fallar más tarde en un pedido cualquiera.
 */
const esquema = z.object({
  apiUrl: z.url({ message: "NEXT_PUBLIC_API_URL tiene que ser una URL completa." }),
  mockHabilitado: z.boolean(),
});

export const config = esquema.parse({
  // Next reemplaza NEXT_PUBLIC_* al compilar, por eso se lee con el nombre exacto.
  apiUrl: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ""),
  mockHabilitado: process.env.MOCK_API_HABILITADO === "true",
});

/** Cuánto esperar una respuesta del backend antes de darla por perdida. */
export const TIEMPO_MAXIMO_PEDIDO_MS = 15_000;

/**
 * Nombres de las cookies que pone el backend al iniciar sesión.
 * Son HttpOnly: el navegador las manda solas y JavaScript no las puede leer.
 */
export const COOKIES = {
  acceso: "laburar_token",
  renovacion: "laburar_refresh",
} as const;

import { ApiError } from "./errores";

/**
 * Para recursos que pueden no existir todavía (por ejemplo, un perfil que
 * el usuario no creó): convierte el 404 en `null` y deja pasar cualquier
 * otro error.
 */
export async function nuloSiNoExiste<T>(promesa: Promise<T>): Promise<T | null> {
  try {
    return await promesa;
  } catch (error) {
    if (error instanceof ApiError && error.codigo === "NO_ENCONTRADO") return null;
    throw error;
  }
}

import { PAISES_RESPALDO } from "@/lib/paises-respaldo";
import type { Pais } from "@/types/usuario";
import { listarPaises } from "./paises";

/** Países del backend; si el pedido falla, la lista local. */
export async function listarPaisesConRespaldo(): Promise<Pais[]> {
  try {
    return await listarPaises();
  } catch {
    return PAISES_RESPALDO;
  }
}

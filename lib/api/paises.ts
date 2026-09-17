import { z } from "zod";
import type { Pais } from "@/types/usuario";
import { pedir } from "./cliente";

const esquemaPaises = z.array(
  z
    .object({ pais_codigo: z.string(), nombre: z.string() })
    .transform((p): Pais => ({ codigo: p.pais_codigo, nombre: p.nombre })),
);

export async function listarPaises(): Promise<Pais[]> {
  return esquemaPaises.parse(await pedir("/paises"));
}

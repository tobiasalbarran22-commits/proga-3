import { z } from "zod";
import { NIVELES_IDIOMA } from "@/types/enums";
import type { Idioma } from "@/types/perfil";
import { crearRecursoLista } from "./recurso-lista";

export type DatosIdioma = Omit<Idioma, "id">;

// Endpoint pendiente de confirmar con backend (ver docs/backend.md).
export const idiomas = crearRecursoLista<Idioma, DatosIdioma>({
  ruta: "/idiomas",
  esquema: z
    .object({ idioma_id: z.string(), idioma: z.string(), nivel: z.enum(NIVELES_IDIOMA) })
    .transform((i) => ({ id: i.idioma_id, idioma: i.idioma, nivel: i.nivel })),
  haciaApi: (d) => ({ idioma: d.idioma, nivel: d.nivel }),
});

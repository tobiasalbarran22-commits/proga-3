/**
 * Educación, experiencia e idiomas siguen el mismo patrón en el backend:
 *   GET  /<ruta>/me     → lista del usuario
 *   POST /<ruta>        → crear
 *   PUT  /<ruta>/{id}   → editar
 *   DELETE /<ruta>/{id} → borrar
 * En lugar de escribir esas cuatro funciones tres veces, se generan acá.
 */

import { z } from "zod";
import { pedir } from "./cliente";

type Configuracion<T, D> = {
  ruta: string;
  /** Valida un elemento que llega del backend y lo convierte al tipo del frontend. */
  esquema: z.ZodType<T>;
  /** Convierte los datos del formulario al formato que espera el backend. */
  haciaApi: (datos: D) => Record<string, unknown>;
};

export function crearRecursoLista<T, D>({ ruta, esquema, haciaApi }: Configuracion<T, D>) {
  const url = (id: string) => `${ruta}/${encodeURIComponent(id)}`;

  return {
    listar: async (): Promise<T[]> => z.array(esquema).parse(await pedir(`${ruta}/me`)),

    crear: async (datos: D): Promise<void> => {
      await pedir(ruta, { metodo: "POST", cuerpo: haciaApi(datos) });
    },

    actualizar: async (id: string, datos: D): Promise<void> => {
      await pedir(url(id), { metodo: "PUT", cuerpo: haciaApi(datos) });
    },

    eliminar: async (id: string): Promise<void> => {
      await pedir(url(id), { metodo: "DELETE" });
    },
  };
}

import { z } from "zod";
import { ESTADOS_EDUCATIVOS, NIVELES_EDUCATIVOS } from "@/types/enums";
import type { Educacion } from "@/types/perfil";
import { crearRecursoLista } from "./recurso-lista";

export type DatosEducacion = Omit<Educacion, "id">;

export const educaciones = crearRecursoLista<Educacion, DatosEducacion>({
  ruta: "/educaciones",
  esquema: z
    .object({
      educacion_id: z.string(),
      institucion: z.string(),
      titulo_carrera: z.string(),
      nivel_educativo: z.enum(NIVELES_EDUCATIVOS),
      estado_educativo: z.enum(ESTADOS_EDUCATIVOS),
      fecha_inicio: z.string(),
      fecha_fin: z.string().nullable(),
    })
    .transform((e) => ({
      id: e.educacion_id,
      institucion: e.institucion,
      tituloCarrera: e.titulo_carrera,
      nivel: e.nivel_educativo,
      estado: e.estado_educativo,
      fechaInicio: e.fecha_inicio,
      fechaFin: e.fecha_fin,
    })),
  haciaApi: (d) => ({
    institucion: d.institucion,
    titulo_carrera: d.tituloCarrera,
    nivel_educativo: d.nivel,
    estado_educativo: d.estado,
    fecha_inicio: d.fechaInicio,
    fecha_fin: d.fechaFin,
  }),
});

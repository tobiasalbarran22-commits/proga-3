import { z } from "zod";
import type { Experiencia } from "@/types/perfil";
import { crearRecursoLista } from "./recurso-lista";

export type DatosExperiencia = Omit<Experiencia, "id">;

export const experiencias = crearRecursoLista<Experiencia, DatosExperiencia>({
  ruta: "/experiencias-laborales",
  esquema: z
    .object({
      experiencia_id: z.string(),
      empresa_nombre: z.string(),
      puesto: z.string(),
      fecha_inicio: z.string(),
      fecha_fin: z.string().nullable(),
      actual: z.boolean(),
      descripcion_experiencia: z.string().nullable(),
    })
    .transform((e) => ({
      id: e.experiencia_id,
      empresaNombre: e.empresa_nombre,
      puesto: e.puesto,
      fechaInicio: e.fecha_inicio,
      fechaFin: e.fecha_fin,
      esActual: e.actual,
      descripcion: e.descripcion_experiencia,
    })),
  haciaApi: (d) => ({
    empresa_nombre: d.empresaNombre,
    puesto: d.puesto,
    fecha_inicio: d.fechaInicio,
    fecha_fin: d.esActual ? null : d.fechaFin,
    actual: d.esActual,
    descripcion_experiencia: d.descripcion,
  }),
});

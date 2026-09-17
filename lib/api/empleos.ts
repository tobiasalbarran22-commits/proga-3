/**
 * Empleos (puestos de trabajo) y postulaciones.
 * Endpoints pendientes de confirmar con backend (ver docs/backend.md).
 */

import { z } from "zod";
import { ESTADOS_POSTULACION, MODALIDADES } from "@/types/enums";
import type { Empleo } from "@/types/empleo";
import type { Postulacion, Postulante } from "@/types/postulacion";
import { pedir } from "./cliente";
import { nuloSiNoExiste } from "./opcional";

const esquemaEmpleo = z
  .object({
    puesto_id: z.string(),
    empresa_id: z.string(),
    empresa_nombre: z.string(),
    titulo: z.string(),
    resumen: z.string(),
    descripcion: z.string(),
    modalidad: z.enum(MODALIDADES),
    ubicacion: z.string(),
    requisitos: z.array(z.string()),
    beneficios: z.array(z.string()),
    habilidades: z.array(z.string()),
    remuneracion: z.string().nullable(),
    fecha_publicacion: z.string(),
  })
  .transform((e): Empleo => ({
    id: e.puesto_id,
    empresaId: e.empresa_id,
    empresaNombre: e.empresa_nombre,
    titulo: e.titulo,
    resumen: e.resumen,
    descripcion: e.descripcion,
    modalidad: e.modalidad,
    ubicacion: e.ubicacion,
    requisitos: e.requisitos,
    beneficios: e.beneficios,
    habilidades: e.habilidades,
    remuneracion: e.remuneracion,
    fechaPublicacion: e.fecha_publicacion,
  }));

export async function listarEmpleos(): Promise<Empleo[]> {
  return z.array(esquemaEmpleo).parse(await pedir("/puestos"));
}

export async function obtenerEmpleo(id: string): Promise<Empleo | null> {
  return nuloSiNoExiste(
    pedir(`/puestos/${encodeURIComponent(id)}`).then((c) => esquemaEmpleo.parse(c)),
  );
}

/** Los empleos publicados por la empresa que inició sesión. */
export async function listarMisEmpleos(): Promise<Empleo[]> {
  return z.array(esquemaEmpleo).parse(await pedir("/puestos/me"));
}

// ---------- Postulaciones ----------

const esquemaPostulacion = z
  .object({
    postulacion_id: z.string(),
    puesto_id: z.string(),
    puesto_titulo: z.string(),
    empresa_nombre: z.string(),
    estado: z.enum(ESTADOS_POSTULACION),
    fecha: z.string(),
  })
  .transform((p): Postulacion => ({
    id: p.postulacion_id,
    empleoId: p.puesto_id,
    empleoTitulo: p.puesto_titulo,
    empresaNombre: p.empresa_nombre,
    estado: p.estado,
    fecha: p.fecha,
  }));

const esquemaPostulante = z
  .object({
    postulacion_id: z.string(),
    nombre_completo: z.string(),
    email: z.string(),
    titulo_profesional: z.string().nullable(),
    estado: z.enum(ESTADOS_POSTULACION),
    fecha: z.string(),
  })
  .transform((p): Postulante => ({
    postulacionId: p.postulacion_id,
    nombreCompleto: p.nombre_completo,
    email: p.email,
    tituloProfesional: p.titulo_profesional,
    estado: p.estado,
    fecha: p.fecha,
  }));

export async function postularme(empleoId: string): Promise<void> {
  await pedir("/postulaciones", { metodo: "POST", cuerpo: { puesto_id: empleoId } });
}

export async function listarMisPostulaciones(): Promise<Postulacion[]> {
  return z.array(esquemaPostulacion).parse(await pedir("/postulaciones/me"));
}

export async function listarPostulantes(empleoId: string): Promise<Postulante[]> {
  return z
    .array(esquemaPostulante)
    .parse(await pedir(`/puestos/${encodeURIComponent(empleoId)}/postulaciones`));
}

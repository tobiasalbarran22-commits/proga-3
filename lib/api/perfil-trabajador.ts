/**
 * Perfil del trabajador (DE03): se crea después del registro y se edita desde /perfil.
 */

import { z } from "zod";
import { NIVELES_EXPERIENCIA, TIPOS_DOCUMENTO } from "@/types/enums";
import type { PerfilTrabajador } from "@/types/perfil";
import { pedir } from "./cliente";
import { nuloSiNoExiste } from "./opcional";

const esquemaPerfilTrabajador = z
  .object({
    perfil_trabajador_id: z.string(),
    nombre: z.string(),
    apellido: z.string(),
    tipo_documento: z.enum(TIPOS_DOCUMENTO),
    numero_documento: z.string(),
    fecha_nacimiento: z.string().nullable(),
    identidad_verificada: z.boolean(),
    pais_codigo: z.string(),
    provincia: z.string(),
    ciudad: z.string(),
    titulo_profesional: z.string().nullable(),
    resumen_profesional: z.string().nullable(),
    nivel_experiencia: z.enum(NIVELES_EXPERIENCIA).nullable(),
    anios_experiencia: z.number().nullable(),
    cv_url: z.string().nullable(),
    linkedin_url: z.string().nullable(),
    portfolio_url: z.string().nullable(),
    perfil_visible: z.boolean(),
  })
  .transform((p): PerfilTrabajador => ({
    id: p.perfil_trabajador_id,
    nombre: p.nombre,
    apellido: p.apellido,
    tipoDocumento: p.tipo_documento,
    numeroDocumento: p.numero_documento,
    fechaNacimiento: p.fecha_nacimiento,
    identidadVerificada: p.identidad_verificada,
    paisCodigo: p.pais_codigo,
    provincia: p.provincia,
    ciudad: p.ciudad,
    tituloProfesional: p.titulo_profesional,
    resumenProfesional: p.resumen_profesional,
    nivelExperiencia: p.nivel_experiencia,
    aniosExperiencia: p.anios_experiencia,
    cvUrl: p.cv_url,
    linkedinUrl: p.linkedin_url,
    portfolioUrl: p.portfolio_url,
    perfilVisible: p.perfil_visible,
  }));

/** Lo que el trabajador puede cargar o editar (sin los campos que decide el backend). */
export type DatosPerfilTrabajador = Omit<PerfilTrabajador, "id" | "identidadVerificada">;

function perfilTrabajadorHaciaApi(d: DatosPerfilTrabajador) {
  return {
    nombre: d.nombre,
    apellido: d.apellido,
    tipo_documento: d.tipoDocumento,
    numero_documento: d.numeroDocumento,
    fecha_nacimiento: d.fechaNacimiento,
    pais_codigo: d.paisCodigo,
    provincia: d.provincia,
    ciudad: d.ciudad,
    titulo_profesional: d.tituloProfesional,
    resumen_profesional: d.resumenProfesional,
    nivel_experiencia: d.nivelExperiencia,
    anios_experiencia: d.aniosExperiencia,
    cv_url: d.cvUrl,
    linkedin_url: d.linkedinUrl,
    portfolio_url: d.portfolioUrl,
    perfil_visible: d.perfilVisible,
  };
}

/** `null` si el trabajador todavía no creó su perfil. */
export async function obtenerMiPerfilTrabajador(): Promise<PerfilTrabajador | null> {
  return nuloSiNoExiste(
    pedir("/perfiles-trabajador/me").then((c) => esquemaPerfilTrabajador.parse(c)),
  );
}

export async function crearPerfilTrabajador(datos: DatosPerfilTrabajador): Promise<void> {
  await pedir("/perfiles-trabajador/", { metodo: "POST", cuerpo: perfilTrabajadorHaciaApi(datos) });
}

export async function actualizarMiPerfilTrabajador(datos: DatosPerfilTrabajador): Promise<void> {
  await pedir("/perfiles-trabajador/me", {
    metodo: "PUT",
    cuerpo: perfilTrabajadorHaciaApi(datos),
  });
}

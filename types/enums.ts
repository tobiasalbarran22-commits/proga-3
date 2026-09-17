/**
 * Valores posibles de cada campo "enumerado" del diccionario de datos.
 *
 * Cada lista se declara `as const` para que TypeScript conozca los valores
 * exactos. De la lista se deriva el tipo, y la misma lista se usa para
 * validar con Zod y para armar los <select>. Así hay una sola fuente.
 *
 * Pendiente de confirmar con backend: ver docs/backend.md.
 */

export const TIPOS_USUARIO = ["TRABAJADOR", "EMPRESA", "ADMINISTRADOR"] as const;
export type TipoUsuario = (typeof TIPOS_USUARIO)[number];

export const ESTADOS_CUENTA = ["ACTIVA", "SUSPENDIDA", "PENDIENTE", "ELIMINADA"] as const;
export type EstadoCuenta = (typeof ESTADOS_CUENTA)[number];

export const MODALIDADES = ["PRESENCIAL", "HIBRIDA", "REMOTA", "INDIFERENTE"] as const;
export type Modalidad = (typeof MODALIDADES)[number];

export const NIVELES_EDUCATIVOS = [
  "SECUNDARIO",
  "TERCIARIO",
  "UNIVERSITARIO",
  "POSGRADO",
  "OTRO",
] as const;
export type NivelEducativo = (typeof NIVELES_EDUCATIVOS)[number];

export const ESTADOS_EDUCATIVOS = ["EN_CURSO", "COMPLETO", "INCOMPLETO"] as const;
export type EstadoEducativo = (typeof ESTADOS_EDUCATIVOS)[number];

export const NIVELES_EXPERIENCIA = ["SIN_EXPERIENCIA", "JUNIOR", "SEMI_SENIOR", "SENIOR"] as const;
export type NivelExperiencia = (typeof NIVELES_EXPERIENCIA)[number];

export const NIVELES_IDIOMA = ["BASICO", "INTERMEDIO", "AVANZADO", "NATIVO"] as const;
export type NivelIdioma = (typeof NIVELES_IDIOMA)[number];

export const TIPOS_DOCUMENTO = ["DNI", "PASAPORTE"] as const;
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];

export const ESTADOS_POSTULACION = [
  "ENVIADA",
  "EN_REVISION",
  "PRESELECCIONADA",
  "RECHAZADA",
  "CONTRATADA",
] as const;
export type EstadoPostulacion = (typeof ESTADOS_POSTULACION)[number];

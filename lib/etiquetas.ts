import type {
  EstadoEducativo,
  EstadoPostulacion,
  Modalidad,
  NivelEducativo,
  NivelExperiencia,
  NivelIdioma,
  TipoDocumento,
  TipoUsuario,
} from "@/types/enums";
import type { Ubicacion } from "@/types/perfil";
import type { Pais } from "@/types/usuario";

/**
 * Textos que ve el usuario para cada valor de los enums.
 * `Record<Tipo, string>` obliga a cubrir TODOS los valores: si se agrega
 * uno nuevo en types/enums.ts, TypeScript marca error acá hasta sumarlo.
 */

export const ETIQUETA_TIPO_USUARIO: Record<TipoUsuario, string> = {
  TRABAJADOR: "Trabajador",
  EMPRESA: "Empresa",
  ADMINISTRADOR: "Administrador",
};

export const ETIQUETA_MODALIDAD: Record<Modalidad, string> = {
  PRESENCIAL: "Presencial",
  HIBRIDA: "Híbrida",
  REMOTA: "Remota",
  INDIFERENTE: "Indiferente",
};

export const ETIQUETA_NIVEL_EDUCATIVO: Record<NivelEducativo, string> = {
  SECUNDARIO: "Secundario",
  TERCIARIO: "Terciario",
  UNIVERSITARIO: "Universitario",
  POSGRADO: "Posgrado",
  OTRO: "Otro",
};

export const ETIQUETA_ESTADO_EDUCATIVO: Record<EstadoEducativo, string> = {
  EN_CURSO: "En curso",
  COMPLETO: "Completo",
  INCOMPLETO: "Incompleto",
};

export const ETIQUETA_NIVEL_EXPERIENCIA: Record<NivelExperiencia, string> = {
  SIN_EXPERIENCIA: "Sin experiencia",
  JUNIOR: "Junior",
  SEMI_SENIOR: "Semi senior",
  SENIOR: "Senior",
};

export const ETIQUETA_NIVEL_IDIOMA: Record<NivelIdioma, string> = {
  BASICO: "Básico",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
  NATIVO: "Nativo",
};

export const ETIQUETA_TIPO_DOCUMENTO: Record<TipoDocumento, string> = {
  DNI: "DNI",
  PASAPORTE: "Pasaporte",
};

export const ETIQUETA_ESTADO_POSTULACION: Record<EstadoPostulacion, string> = {
  ENVIADA: "Enviada",
  EN_REVISION: "En revisión",
  PRESELECCIONADA: "Preseleccionada",
  RECHAZADA: "No seleccionada",
  CONTRATADA: "Contratada",
};

/** Convierte un Record de etiquetas en opciones para un <select>. */
export function opcionesDe<T extends string>(etiquetas: Record<T, string>) {
  return Object.entries<string>(etiquetas).map(([valor, etiqueta]) => ({ valor, etiqueta }));
}

/** Formatea una fecha ISO (AAAA-MM-DD o completa) como 15/09/2026. */
export function formatearFecha(iso: string) {
  const [anio, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

/** "Ciudad, Provincia, País". Si el país no está en la lista, muestra su código. */
export function formatearUbicacion(ubicacion: Ubicacion, paises: Pais[]) {
  const pais =
    paises.find((p) => p.codigo === ubicacion.paisCodigo)?.nombre ?? ubicacion.paisCodigo;
  return `${ubicacion.ciudad}, ${ubicacion.provincia}, ${pais}`;
}

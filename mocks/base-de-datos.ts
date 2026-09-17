/**
 * "Base de datos" en memoria del backend simulado.
 *
 * Se guarda en `globalThis` para que los datos sobrevivan cuando Next
 * recarga los módulos en desarrollo. Se reinicia al reiniciar `npm run dev`.
 */

import * as semillas from "./semillas";
import type {
  EducacionMock,
  ExperienciaMock,
  IdiomaMock,
  PerfilEmpresaMock,
  PerfilTrabajadorMock,
  PostulacionMock,
  PreferenciaMock,
  PuestoMock,
  UsuarioMock,
} from "./tipos";

export type BaseDeDatos = {
  usuarios: UsuarioMock[];
  perfilesTrabajador: PerfilTrabajadorMock[];
  perfilesEmpresa: PerfilEmpresaMock[];
  educaciones: EducacionMock[];
  experiencias: ExperienciaMock[];
  idiomas: IdiomaMock[];
  habilidades: Record<string, string[]>;
  preferencias: Record<string, PreferenciaMock>;
  puestos: PuestoMock[];
  postulaciones: PostulacionMock[];
};

function crear(): BaseDeDatos {
  // structuredClone: las semillas nunca se modifican, se trabaja sobre una copia.
  return structuredClone({
    usuarios: semillas.USUARIOS,
    perfilesTrabajador: semillas.PERFILES_TRABAJADOR,
    perfilesEmpresa: semillas.PERFILES_EMPRESA,
    educaciones: semillas.EDUCACIONES,
    experiencias: semillas.EXPERIENCIAS,
    idiomas: semillas.IDIOMAS,
    habilidades: semillas.HABILIDADES,
    preferencias: {},
    puestos: semillas.PUESTOS,
    postulaciones: semillas.POSTULACIONES,
  });
}

const global = globalThis as typeof globalThis & { __laburarMock?: BaseDeDatos };

export const db: BaseDeDatos = (global.__laburarMock ??= crear());

/** Genera un id legible y único para los registros nuevos. */
export function nuevoId(prefijo: string) {
  return `${prefijo}-${crypto.randomUUID().slice(0, 8)}`;
}

export function hoy() {
  return new Date().toISOString().slice(0, 10);
}

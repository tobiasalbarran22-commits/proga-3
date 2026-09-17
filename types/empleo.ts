import type { Modalidad } from "./enums";

/** Una búsqueda laboral publicada por una empresa (puesto de trabajo). */
export type Empleo = {
  id: string;
  empresaId: string;
  empresaNombre: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  modalidad: Modalidad;
  ubicacion: string;
  requisitos: string[];
  beneficios: string[];
  habilidades: string[];
  remuneracion: string | null;
  fechaPublicacion: string;
};

import type { EstadoPostulacion } from "./enums";

/** Una postulación vista por el trabajador que la hizo. */
export type Postulacion = {
  id: string;
  empleoId: string;
  empleoTitulo: string;
  empresaNombre: string;
  estado: EstadoPostulacion;
  fecha: string;
};

/** Una postulación vista por la empresa que publicó el empleo. */
export type Postulante = {
  postulacionId: string;
  nombreCompleto: string;
  email: string;
  tituloProfesional: string | null;
  estado: EstadoPostulacion;
  fecha: string;
};

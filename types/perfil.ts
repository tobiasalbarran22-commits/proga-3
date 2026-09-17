import type {
  EstadoEducativo,
  Modalidad,
  NivelEducativo,
  NivelExperiencia,
  NivelIdioma,
  TipoDocumento,
} from "./enums";

/** Ubicación compartida por trabajadores y empresas. */
export type Ubicacion = {
  paisCodigo: string;
  provincia: string;
  ciudad: string;
};

/** Perfil del trabajador (DE03). */
export type PerfilTrabajador = Ubicacion & {
  id: string;
  nombre: string;
  apellido: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  fechaNacimiento: string | null;
  identidadVerificada: boolean;
  tituloProfesional: string | null;
  resumenProfesional: string | null;
  nivelExperiencia: NivelExperiencia | null;
  aniosExperiencia: number | null;
  cvUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  perfilVisible: boolean;
};

/** Perfil de la empresa. */
export type PerfilEmpresa = Ubicacion & {
  id: string;
  razonSocial: string;
  identificacionFiscal: string;
  nombreComercial: string;
  descripcion: string;
  rubro: string;
  sitioWeb: string | null;
  logoUrl: string | null;
  verificadaArca: boolean;
};

/** Un estudio del trabajador (DE04). */
export type Educacion = {
  id: string;
  institucion: string;
  tituloCarrera: string;
  nivel: NivelEducativo;
  estado: EstadoEducativo;
  fechaInicio: string;
  fechaFin: string | null;
};

/** Una experiencia laboral del trabajador (DE05). */
export type Experiencia = {
  id: string;
  empresaNombre: string;
  puesto: string;
  fechaInicio: string;
  fechaFin: string | null;
  esActual: boolean;
  descripcion: string | null;
};

/** Un idioma del trabajador (DE07). */
export type Idioma = {
  id: string;
  idioma: string;
  nivel: NivelIdioma;
};

/** Preferencias laborales del trabajador. */
export type PreferenciaLaboral = {
  areasInteres: string[];
  tiposPuesto: string[];
  modalidad: Modalidad;
};

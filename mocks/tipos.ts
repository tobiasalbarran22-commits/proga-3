/**
 * Forma de los datos tal como los guarda el backend (snake_case).
 * El backend simulado trabaja con esta forma para que lib/api haga
 * exactamente la misma traducción que hará con el backend real.
 */

import type {
  EstadoCuenta,
  EstadoEducativo,
  EstadoPostulacion,
  Modalidad,
  NivelEducativo,
  NivelExperiencia,
  NivelIdioma,
  TipoDocumento,
  TipoUsuario,
} from "@/types/enums";

export type UsuarioMock = {
  usuario_id: string;
  email: string;
  password: string;
  tipo_usuario: TipoUsuario;
  estado_cuenta: EstadoCuenta;
  email_verificado: boolean;
};

export type PerfilTrabajadorMock = {
  perfil_trabajador_id: string;
  usuario_id: string;
  nombre: string;
  apellido: string;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  fecha_nacimiento: string | null;
  identidad_verificada: boolean;
  pais_codigo: string;
  provincia: string;
  ciudad: string;
  titulo_profesional: string | null;
  resumen_profesional: string | null;
  nivel_experiencia: NivelExperiencia | null;
  anios_experiencia: number | null;
  cv_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  perfil_visible: boolean;
};

export type PerfilEmpresaMock = {
  empresa_id: string;
  usuario_id: string;
  razon_social: string;
  identificacion_fiscal: string;
  nombre_comercial: string;
  descripcion_empresa: string;
  rubro: string;
  sitio_web: string | null;
  logo_url: string | null;
  pais_codigo: string;
  provincia: string;
  ciudad: string;
  arca_verificada: boolean;
};

export type EducacionMock = {
  educacion_id: string;
  usuario_id: string;
  institucion: string;
  titulo_carrera: string;
  nivel_educativo: NivelEducativo;
  estado_educativo: EstadoEducativo;
  fecha_inicio: string;
  fecha_fin: string | null;
};

export type ExperienciaMock = {
  experiencia_id: string;
  usuario_id: string;
  empresa_nombre: string;
  puesto: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  actual: boolean;
  descripcion_experiencia: string | null;
};

export type IdiomaMock = {
  idioma_id: string;
  usuario_id: string;
  idioma: string;
  nivel: NivelIdioma;
};

export type PreferenciaMock = {
  areas_interes: string[];
  tipos_puesto: string[];
  modalidad: Modalidad;
};

export type PuestoMock = {
  puesto_id: string;
  empresa_id: string;
  empresa_nombre: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  modalidad: Modalidad;
  ubicacion: string;
  requisitos: string[];
  beneficios: string[];
  habilidades: string[];
  remuneracion: string | null;
  fecha_publicacion: string;
};

export type PostulacionMock = {
  postulacion_id: string;
  puesto_id: string;
  usuario_id: string;
  estado: EstadoPostulacion;
  fecha: string;
};

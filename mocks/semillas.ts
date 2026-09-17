/**
 * Datos con los que arranca el backend simulado cada vez que se levanta
 * el servidor de desarrollo. Todas las cuentas usan la contraseña "demo1234".
 */

import type {
  EducacionMock,
  ExperienciaMock,
  IdiomaMock,
  PerfilEmpresaMock,
  PerfilTrabajadorMock,
  PostulacionMock,
  PuestoMock,
  UsuarioMock,
} from "./tipos";

export const CONTRASENA_DEMO = "demo1234";
export const CODIGO_VERIFICACION_DEMO = "123456";
export const TOKEN_RESTABLECER_DEMO = "token-demo";

function usuario(
  id: string,
  email: string,
  tipo: UsuarioMock["tipo_usuario"],
  verificado = true,
): UsuarioMock {
  return {
    usuario_id: id,
    email,
    password: CONTRASENA_DEMO,
    tipo_usuario: tipo,
    estado_cuenta: verificado ? "ACTIVA" : "PENDIENTE_VERIFICACION",
    email_verificado: verificado,
  };
}

export const USUARIOS: UsuarioMock[] = [
  usuario("u-trabajador", "trabajador@ejemplo.com", "TRABAJADOR"),
  usuario("u-ana", "ana@ejemplo.com", "TRABAJADOR"),
  usuario("u-nuevo", "nuevo@ejemplo.com", "TRABAJADOR", false),
  usuario("u-empresa", "empresa@ejemplo.com", "EMPRESA"),
  usuario("u-estudio", "estudio@ejemplo.com", "EMPRESA"),
  usuario("u-admin", "admin@ejemplo.com", "ADMINISTRADOR"),
];

function perfilTrabajador(
  usuarioId: string,
  datos: Pick<
    PerfilTrabajadorMock,
    "nombre" | "apellido" | "numero_documento" | "titulo_profesional"
  >,
): PerfilTrabajadorMock {
  return {
    perfil_trabajador_id: `pt-${usuarioId}`,
    usuario_id: usuarioId,
    tipo_documento: "DNI",
    fecha_nacimiento: "1998-04-12",
    identidad_verificada: false,
    pais_codigo: "AR",
    provincia: "Buenos Aires",
    ciudad: "La Plata",
    resumen_profesional: "Desarrollador con foco en interfaces accesibles y código mantenible.",
    nivel_experiencia: "JUNIOR",
    anios_experiencia: 2,
    cv_url: null,
    linkedin_url: null,
    portfolio_url: null,
    perfil_visible: true,
    ...datos,
  };
}

export const PERFILES_TRABAJADOR: PerfilTrabajadorMock[] = [
  perfilTrabajador("u-trabajador", {
    nombre: "Juan",
    apellido: "Pérez",
    numero_documento: "30123456",
    titulo_profesional: "Desarrollador frontend",
  }),
  perfilTrabajador("u-ana", {
    nombre: "Ana",
    apellido: "Gómez",
    numero_documento: "35987654",
    titulo_profesional: "Diseñadora UI",
  }),
];

function perfilEmpresa(
  usuarioId: string,
  datos: Pick<
    PerfilEmpresaMock,
    "razon_social" | "identificacion_fiscal" | "nombre_comercial" | "rubro" | "ciudad" | "provincia"
  >,
): PerfilEmpresaMock {
  return {
    empresa_id: `emp-${usuarioId}`,
    usuario_id: usuarioId,
    descripcion_empresa:
      "Empresa de tecnología que desarrolla productos para el mercado argentino.",
    sitio_web: null,
    logo_url: null,
    pais_codigo: "AR",
    arca_verificada: false,
    ...datos,
  };
}

export const PERFILES_EMPRESA: PerfilEmpresaMock[] = [
  perfilEmpresa("u-empresa", {
    razon_social: "laburAR Tech S.A.",
    identificacion_fiscal: "30712345671",
    nombre_comercial: "laburAR Tech",
    rubro: "Desarrollo de software",
    provincia: "CABA",
    ciudad: "Buenos Aires",
  }),
  perfilEmpresa("u-estudio", {
    razon_social: "Estudio Rioplatense S.R.L.",
    identificacion_fiscal: "30798765430",
    nombre_comercial: "Estudio Rioplatense",
    rubro: "Diseño digital",
    provincia: "Córdoba",
    ciudad: "Córdoba",
  }),
];

export const EDUCACIONES: EducacionMock[] = [
  {
    educacion_id: "edu-1",
    usuario_id: "u-trabajador",
    institucion: "Universidad Tecnológica Nacional",
    titulo_carrera: "Tecnicatura en Programación",
    nivel_educativo: "TERCIARIO",
    estado_educativo: "EN_CURSO",
    fecha_inicio: "2023-03-01",
    fecha_fin: null,
  },
];

export const EXPERIENCIAS: ExperienciaMock[] = [
  {
    experiencia_id: "exp-1",
    usuario_id: "u-trabajador",
    empresa_nombre: "Agencia Sur",
    puesto: "Desarrollador web trainee",
    fecha_inicio: "2024-02-01",
    fecha_fin: "2025-01-31",
    actual: false,
    descripcion_experiencia: "Maquetado de sitios institucionales con React.",
  },
];

export const IDIOMAS: IdiomaMock[] = [
  { idioma_id: "idi-1", usuario_id: "u-trabajador", idioma: "Inglés", nivel: "INTERMEDIO" },
];

export const HABILIDADES: Record<string, string[]> = {
  "u-trabajador": ["React", "TypeScript", "Tailwind CSS"],
  "u-ana": ["Figma", "Accesibilidad"],
};

function puesto(datos: Omit<PuestoMock, "fecha_publicacion">): PuestoMock {
  return { ...datos, fecha_publicacion: "2026-09-01" };
}

export const PUESTOS: PuestoMock[] = [
  puesto({
    puesto_id: "p-1",
    empresa_id: "u-empresa",
    empresa_nombre: "laburAR Tech",
    titulo: "Desarrollador/a TypeScript semi senior",
    resumen: "Sumate al equipo que construye el servicio de postulaciones de la plataforma.",
    descripcion:
      "Vas a trabajar en el equipo central, construyendo y manteniendo los servicios que conectan trabajadores y empresas. Usamos TypeScript de punta a punta y PostgreSQL.",
    modalidad: "REMOTA",
    ubicacion: "Buenos Aires, Argentina",
    requisitos: [
      "2 años o más con TypeScript o Node.js",
      "Experiencia con bases SQL",
      "Inglés técnico",
    ],
    beneficios: ["Horario flexible", "Presupuesto para equipamiento"],
    habilidades: ["TypeScript", "Node.js", "PostgreSQL"],
    remuneracion: "USD 1.800 por mes",
  }),
  puesto({
    puesto_id: "p-2",
    empresa_id: "u-estudio",
    empresa_nombre: "Estudio Rioplatense",
    titulo: "Diseñador/a UI con Tailwind",
    resumen: "Buscamos a alguien que arme sistemas de diseño con componentes reutilizables.",
    descripcion:
      "Estamos armando el sistema de diseño para varios clientes. Buscamos a alguien que pase de Figma a componentes reales cuidando la consistencia y la accesibilidad.",
    modalidad: "HIBRIDA",
    ubicacion: "Córdoba, Argentina",
    requisitos: [
      "Portfolio con trabajos de UI",
      "Figma y Tailwind CSS",
      "Nociones de accesibilidad",
    ],
    beneficios: ["Dos días en oficina", "Capacitaciones pagas"],
    habilidades: ["Figma", "Tailwind CSS", "Accesibilidad"],
    remuneracion: null,
  }),
  puesto({
    puesto_id: "p-3",
    empresa_id: "u-empresa",
    empresa_nombre: "laburAR Tech",
    titulo: "QA Automation",
    resumen: "Diseñar y mantener los tests de punta a punta del flujo de postulación.",
    descripcion:
      "Te vas a hacer cargo de la calidad del flujo de postulaciones, desde el registro de un trabajador hasta el contacto de una empresa, con tests automatizados integrados al CI.",
    modalidad: "REMOTA",
    ubicacion: "Remoto (Latinoamérica)",
    requisitos: ["Experiencia con Playwright o Cypress", "Conocimientos de TypeScript"],
    beneficios: ["Pago en dólares", "Equipo distribuido"],
    habilidades: ["Playwright", "TypeScript", "CI/CD"],
    remuneracion: "USD 1.400 por mes",
  }),
];

export const POSTULACIONES: PostulacionMock[] = [
  {
    postulacion_id: "post-1",
    puesto_id: "p-1",
    usuario_id: "u-ana",
    estado: "EN_REVISION",
    fecha: "2026-09-05",
  },
];

export const PAISES = [
  { pais_codigo: "AR", nombre: "Argentina" },
  { pais_codigo: "BO", nombre: "Bolivia" },
  { pais_codigo: "BR", nombre: "Brasil" },
  { pais_codigo: "CL", nombre: "Chile" },
  { pais_codigo: "CO", nombre: "Colombia" },
  { pais_codigo: "EC", nombre: "Ecuador" },
  { pais_codigo: "ES", nombre: "España" },
  { pais_codigo: "US", nombre: "Estados Unidos" },
  { pais_codigo: "MX", nombre: "México" },
  { pais_codigo: "PY", nombre: "Paraguay" },
  { pais_codigo: "PE", nombre: "Perú" },
  { pais_codigo: "UY", nombre: "Uruguay" },
  { pais_codigo: "VE", nombre: "Venezuela" },
];

import { z } from "zod";
import {
  ESTADOS_EDUCATIVOS,
  MODALIDADES,
  NIVELES_EDUCATIVOS,
  NIVELES_EXPERIENCIA,
  NIVELES_IDIOMA,
  TIPOS_DOCUMENTO,
} from "@/types/enums";
import {
  casilla,
  conConfirmacion,
  contrasenaActual,
  contrasenaNueva,
  fechaOpcional,
  fechaRequerida,
  listaDeTextos,
  numeroOpcional,
  opcionDe,
  opcionOpcional,
  textoOpcional,
  textoRequerido,
  urlOpcional,
} from "@/lib/formulario/reglas";
import { fechaNacimiento, reglasUbicacion } from "@/lib/formulario/reglas-ubicacion";

const MENSAJE_FECHAS = "La fecha de fin no puede ser anterior a la de inicio.";

export const esquemaPerfilTrabajador = z.object({
  nombre: textoRequerido("Ingresá tu nombre.", 80),
  apellido: textoRequerido("Ingresá tu apellido.", 80),
  tipoDocumento: opcionDe(TIPOS_DOCUMENTO, "Elegí el tipo de documento."),
  numeroDocumento: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,20}$/, "Ingresá el número sin puntos ni espacios."),
  fechaNacimiento,
  ...reglasUbicacion,
  tituloProfesional: textoOpcional(120),
  resumenProfesional: textoOpcional(2000),
  nivelExperiencia: opcionOpcional(NIVELES_EXPERIENCIA),
  aniosExperiencia: numeroOpcional,
  cvUrl: urlOpcional,
  linkedinUrl: urlOpcional,
  portfolioUrl: urlOpcional,
  perfilVisible: casilla,
});

export const esquemaEducacion = z
  .object({
    institucion: textoRequerido("Ingresá la institución."),
    tituloCarrera: textoRequerido("Ingresá el título o la carrera."),
    nivel: opcionDe(NIVELES_EDUCATIVOS, "Elegí el nivel."),
    estado: opcionDe(ESTADOS_EDUCATIVOS, "Elegí el estado."),
    fechaInicio: fechaRequerida("Ingresá la fecha de inicio."),
    fechaFin: fechaOpcional,
  })
  .refine((d) => !d.fechaFin || d.fechaFin >= d.fechaInicio, {
    path: ["fechaFin"],
    message: MENSAJE_FECHAS,
  });

export const esquemaExperiencia = z
  .object({
    empresaNombre: textoRequerido("Ingresá la empresa."),
    puesto: textoRequerido("Ingresá el puesto."),
    fechaInicio: fechaRequerida("Ingresá la fecha de inicio."),
    fechaFin: fechaOpcional,
    esActual: casilla,
    descripcion: textoOpcional(1000),
  })
  .refine((d) => d.esActual || Boolean(d.fechaFin), {
    path: ["fechaFin"],
    message: "Ingresá la fecha de fin o marcá que es tu trabajo actual.",
  })
  .refine((d) => d.esActual || !d.fechaFin || d.fechaFin >= d.fechaInicio, {
    path: ["fechaFin"],
    message: MENSAJE_FECHAS,
  })
  .transform((d) => ({ ...d, fechaFin: d.esActual ? null : d.fechaFin }));

export const esquemaIdioma = z.object({
  idioma: textoRequerido("Ingresá el idioma.", 60),
  nivel: opcionDe(NIVELES_IDIOMA, "Elegí el nivel."),
});

export const esquemaHabilidades = z.object({ habilidades: listaDeTextos });

export const esquemaPreferencias = z.object({
  areasInteres: listaDeTextos,
  tiposPuesto: listaDeTextos,
  modalidad: opcionDe(MODALIDADES, "Elegí una modalidad."),
});

export const esquemaPerfilEmpresa = z.object({
  nombreComercial: textoRequerido("Ingresá el nombre comercial.", 180),
  rubro: textoRequerido("Ingresá el rubro.", 120),
  descripcion: textoRequerido("Contá brevemente a qué se dedica la empresa.", 2000),
  sitioWeb: urlOpcional,
  logoUrl: urlOpcional,
  ...reglasUbicacion,
});

export const esquemaCambioContrasena = conConfirmacion(
  z.object({
    actual: contrasenaActual,
    contrasena: contrasenaNueva,
    confirmacion: z.string(),
  }),
);

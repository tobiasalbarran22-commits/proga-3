import { z } from "zod";
import {
  casilla,
  conConfirmacion,
  contrasenaActual,
  contrasenaNueva,
  cuit,
  dni,
  email,
  textoRequerido,
} from "@/lib/formulario/reglas";
import { fechaNacimiento, reglasUbicacion } from "@/lib/formulario/reglas-ubicacion";

const aceptaTerminos = casilla.refine(Boolean, "Tenés que aceptar los términos para continuar.");

export const esquemaLogin = z.object({
  email,
  contrasena: contrasenaActual,
});

export const esquemaRegistroTrabajador = conConfirmacion(
  z.object({
    nombre: textoRequerido("Ingresá tu nombre.", 80),
    apellido: textoRequerido("Ingresá tu apellido.", 80),
    email,
    dni,
    fechaNacimiento,
    ...reglasUbicacion,
    contrasena: contrasenaNueva,
    confirmacion: z.string(),
    aceptaTerminos,
  }),
);
export type DatosRegistroTrabajador = z.infer<typeof esquemaRegistroTrabajador>;

export const esquemaRegistroEmpresa = conConfirmacion(
  z.object({
    razonSocial: textoRequerido("Ingresá la razón social.", 180),
    identificacionFiscal: cuit,
    nombreComercial: textoRequerido("Ingresá el nombre comercial.", 180),
    rubro: textoRequerido("Ingresá el rubro.", 120),
    descripcion: textoRequerido("Contá brevemente a qué se dedica la empresa.", 2000),
    ...reglasUbicacion,
    email,
    contrasena: contrasenaNueva,
    confirmacion: z.string(),
    aceptaTerminos,
  }),
);

export const esquemaRecuperar = z.object({ email });

export const esquemaRestablecer = conConfirmacion(
  z.object({ contrasena: contrasenaNueva, confirmacion: z.string() }),
);

export const esquemaCodigo = z.object({
  codigo: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "El código tiene 6 números."),
});

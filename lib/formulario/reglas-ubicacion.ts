import { z } from "zod";
import { textoRequerido } from "./reglas";

export const reglasUbicacion = {
  paisCodigo: z.string().length(2, "Elegí un país."),
  provincia: textoRequerido("Ingresá la provincia.", 100),
  ciudad: textoRequerido("Ingresá la ciudad.", 100),
};

/** Verdadero si la fecha (AAAA-MM-DD) corresponde a alguien de al menos `anios` años. */
export function tieneEdadMinima(fecha: string, anios: number) {
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - anios);
  return fecha <= limite.toISOString().slice(0, 10);
}

export const EDAD_MINIMA = 16;
export const fechaNacimiento = z.iso
  .date("Ingresá tu fecha de nacimiento.")
  .refine((f) => tieneEdadMinima(f, EDAD_MINIMA), `Tenés que tener al menos ${EDAD_MINIMA} años.`)
  .refine((f) => f >= "1900-01-01", "Revisá el año.");

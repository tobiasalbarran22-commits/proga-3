/**
 * Habilidades y preferencias laborales del trabajador.
 * Endpoints pendientes de confirmar con backend (ver docs/backend.md).
 */

import { z } from "zod";
import { MODALIDADES } from "@/types/enums";
import type { PreferenciaLaboral } from "@/types/perfil";
import { pedir } from "./cliente";
import { nuloSiNoExiste } from "./opcional";

const esquemaHabilidades = z.object({ habilidades: z.array(z.string()) });

export async function obtenerMisHabilidades(): Promise<string[]> {
  return esquemaHabilidades.parse(await pedir("/habilidades/me")).habilidades;
}

/** Reemplaza la lista completa de habilidades. */
export async function guardarMisHabilidades(habilidades: string[]): Promise<void> {
  await pedir("/habilidades/me", { metodo: "PUT", cuerpo: { habilidades } });
}

const esquemaPreferencia = z
  .object({
    areas_interes: z.array(z.string()),
    tipos_puesto: z.array(z.string()),
    modalidad: z.enum(MODALIDADES),
  })
  .transform((p): PreferenciaLaboral => ({
    areasInteres: p.areas_interes,
    tiposPuesto: p.tipos_puesto,
    modalidad: p.modalidad,
  }));

function preferenciaHaciaApi(d: PreferenciaLaboral) {
  return {
    areas_interes: d.areasInteres,
    tipos_puesto: d.tiposPuesto,
    modalidad: d.modalidad,
  };
}

export async function obtenerMiPreferencia(): Promise<PreferenciaLaboral | null> {
  return nuloSiNoExiste(
    pedir("/preferencias-laborales/me").then((c) => esquemaPreferencia.parse(c)),
  );
}

export async function guardarMiPreferencia(datos: PreferenciaLaboral): Promise<void> {
  await pedir("/preferencias-laborales/me", { metodo: "PUT", cuerpo: preferenciaHaciaApi(datos) });
}

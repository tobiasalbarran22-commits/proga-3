/**
 * Perfil de la empresa: se crea al registrarse y se edita desde /perfil.
 */

import { z } from "zod";
import type { PerfilEmpresa, Ubicacion } from "@/types/perfil";
import { pedir } from "./cliente";
import { nuloSiNoExiste } from "./opcional";

const esquemaPerfilEmpresa = z
  .object({
    empresa_id: z.string(),
    razon_social: z.string(),
    identificacion_fiscal: z.string(),
    nombre_comercial: z.string(),
    descripcion_empresa: z.string(),
    rubro: z.string(),
    sitio_web: z.string().nullable(),
    logo_url: z.string().nullable(),
    pais_codigo: z.string(),
    provincia: z.string(),
    ciudad: z.string(),
    arca_verificada: z.boolean(),
  })
  .transform((e): PerfilEmpresa => ({
    id: e.empresa_id,
    razonSocial: e.razon_social,
    identificacionFiscal: e.identificacion_fiscal,
    nombreComercial: e.nombre_comercial,
    descripcion: e.descripcion_empresa,
    rubro: e.rubro,
    sitioWeb: e.sitio_web,
    logoUrl: e.logo_url,
    paisCodigo: e.pais_codigo,
    provincia: e.provincia,
    ciudad: e.ciudad,
    verificadaArca: e.arca_verificada,
  }));

/** La razón social y el CUIT se cargan al registrarse y no se editan desde acá. */
export type DatosPerfilEmpresa = Ubicacion & {
  nombreComercial: string;
  descripcion: string;
  rubro: string;
  sitioWeb: string | null;
  logoUrl: string | null;
};

function perfilEmpresaHaciaApi(d: DatosPerfilEmpresa) {
  return {
    nombre_comercial: d.nombreComercial,
    descripcion_empresa: d.descripcion,
    rubro: d.rubro,
    sitio_web: d.sitioWeb,
    logo_url: d.logoUrl,
    pais_codigo: d.paisCodigo,
    provincia: d.provincia,
    ciudad: d.ciudad,
  };
}

export async function obtenerMiPerfilEmpresa(): Promise<PerfilEmpresa | null> {
  return nuloSiNoExiste(pedir("/perfiles-empresa/me").then((c) => esquemaPerfilEmpresa.parse(c)));
}

export async function actualizarMiPerfilEmpresa(datos: DatosPerfilEmpresa): Promise<void> {
  await pedir("/perfiles-empresa/me", { metodo: "PUT", cuerpo: perfilEmpresaHaciaApi(datos) });
}

import { Badge } from "@/components/ui/badge";
import { DataList } from "@/components/ui/data-list";
import { EnlaceExterno } from "@/components/ui/enlace-externo";
import {
  ETIQUETA_NIVEL_EXPERIENCIA,
  ETIQUETA_TIPO_DOCUMENTO,
  formatearFecha,
  formatearUbicacion,
} from "@/lib/etiquetas";
import type { PerfilTrabajador } from "@/types/perfil";
import type { Pais } from "@/types/usuario";

/** Cómo se ven los datos del trabajador cuando no se están editando. */
export function VistaPerfilTrabajador({
  perfil,
  paises,
}: {
  perfil: PerfilTrabajador;
  paises: Pais[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tono={perfil.perfilVisible ? "exito" : "neutro"}>
          {perfil.perfilVisible ? "Visible para empresas" : "Oculto para empresas"}
        </Badge>
        {perfil.identidadVerificada && <Badge tono="marca">Identidad verificada</Badge>}
      </div>
      <DataList
        datos={[
          { etiqueta: "Nombre", valor: `${perfil.nombre} ${perfil.apellido}` },
          {
            etiqueta: ETIQUETA_TIPO_DOCUMENTO[perfil.tipoDocumento],
            valor: perfil.numeroDocumento,
          },
          {
            etiqueta: "Fecha de nacimiento",
            valor: perfil.fechaNacimiento && formatearFecha(perfil.fechaNacimiento),
          },
          { etiqueta: "Ubicación", valor: formatearUbicacion(perfil, paises) },
          { etiqueta: "Título profesional", valor: perfil.tituloProfesional },
          {
            etiqueta: "Experiencia",
            valor: [
              perfil.nivelExperiencia && ETIQUETA_NIVEL_EXPERIENCIA[perfil.nivelExperiencia],
              perfil.aniosExperiencia !== null && `${perfil.aniosExperiencia} años`,
            ]
              .filter(Boolean)
              .join(" · "),
          },
          { etiqueta: "CV", valor: <EnlaceExterno url={perfil.cvUrl} /> },
          { etiqueta: "LinkedIn", valor: <EnlaceExterno url={perfil.linkedinUrl} /> },
          { etiqueta: "Portfolio", valor: <EnlaceExterno url={perfil.portfolioUrl} /> },
        ]}
      />
      {perfil.resumenProfesional && (
        <div>
          <h3 className="text-xs font-medium text-tinta-tenue">Resumen profesional</h3>
          <p className="mt-1 text-sm whitespace-pre-line text-tinta">{perfil.resumenProfesional}</p>
        </div>
      )}
    </div>
  );
}

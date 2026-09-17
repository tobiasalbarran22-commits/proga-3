"use client";

import type { PerfilTrabajador } from "@/types/perfil";
import type { Pais } from "@/types/usuario";
import { FormularioPerfilTrabajador } from "./formulario-perfil-trabajador";
import { SeccionEditable } from "./seccion-editable";
import { VistaPerfilTrabajador } from "./vista-perfil-trabajador";

type Props = { perfil: PerfilTrabajador | null; paises: Pais[] };

/**
 * Sección principal del perfil del trabajador.
 * Si todavía no tiene perfil, arranca directamente en modo edición.
 */
export function PerfilTrabajadorSeccion({ perfil, paises }: Props) {
  return (
    <SeccionEditable
      titulo="Datos personales y profesionales"
      descripcion={perfil ? undefined : "Completá tu perfil para poder postularte a empleos."}
      obligatorio={!perfil}
      vista={perfil && <VistaPerfilTrabajador perfil={perfil} paises={paises} />}
      formulario={(acciones) => (
        <FormularioPerfilTrabajador perfil={perfil} paises={paises} {...acciones} />
      )}
    />
  );
}

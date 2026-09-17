"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export type PropsFormularioSeccion = {
  onListo: () => void;
  /** No existe cuando el formulario es obligatorio (por ejemplo, crear el perfil). */
  onCancelar?: () => void;
};

type Props = {
  titulo: string;
  descripcion?: string;
  /** Cómo se ven los datos guardados. */
  vista: ReactNode;
  /** Dibuja el formulario. Recibe qué hacer al terminar o cancelar. */
  formulario: (props: PropsFormularioSeccion) => ReactNode;
  /** Abre directamente el formulario, sin opción de cancelar (datos que faltan). */
  obligatorio?: boolean;
};

/**
 * Sección con un único registro que alterna entre "ver" y "editar".
 * La usan el perfil del trabajador, las habilidades, las preferencias
 * y el perfil de empresa.
 */
export function SeccionEditable({ titulo, descripcion, vista, formulario, obligatorio }: Props) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);

  function terminar() {
    setEditando(false);
    router.refresh();
  }

  if (obligatorio) {
    return (
      <Panel titulo={titulo} descripcion={descripcion}>
        {formulario({ onListo: terminar })}
      </Panel>
    );
  }

  return (
    <Panel
      titulo={titulo}
      descripcion={descripcion}
      accion={
        !editando && (
          <Button variante="secundario" tamano="sm" onClick={() => setEditando(true)}>
            Editar
          </Button>
        )
      }
    >
      {editando ? formulario({ onListo: terminar, onCancelar: () => setEditando(false) }) : vista}
    </Panel>
  );
}

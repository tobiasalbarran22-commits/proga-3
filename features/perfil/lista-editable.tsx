"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentType, type ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { mensajeParaUsuario } from "@/lib/api/errores";

/** Lo que recibe el formulario de cada elemento. */
export type PropsFormularioItem<T> = {
  inicial: T | null;
  onListo: () => void;
  onCancelar: () => void;
};

type Props<T extends { id: string }> = {
  titulo: string;
  textoVacio: string;
  textoAgregar: string;
  items: T[];
  mostrar: (item: T) => ReactNode;
  Formulario: ComponentType<PropsFormularioItem<T>>;
  eliminar: (id: string) => Promise<void>;
};

type Modo = { tipo: "viendo" } | { tipo: "creando" } | { tipo: "editando"; id: string };

/**
 * Lista con alta, edición y baja. La usan educación, experiencia e idiomas:
 * cada una solo aporta cómo se ve un elemento y su formulario.
 *
 * Después de guardar o borrar se llama a router.refresh(): Next vuelve a
 * pedir los datos en el servidor y la lista se actualiza sola.
 */
export function ListaEditable<T extends { id: string }>(props: Props<T>) {
  const { titulo, textoVacio, textoAgregar, items, mostrar, Formulario, eliminar } = props;
  const router = useRouter();
  const [modo, setModo] = useState<Modo>({ tipo: "viendo" });
  const [error, setError] = useState<string | null>(null);

  function terminar() {
    setModo({ tipo: "viendo" });
    router.refresh();
  }

  async function borrar(id: string) {
    setError(null);
    try {
      await eliminar(id);
      router.refresh();
    } catch (e) {
      setError(mensajeParaUsuario(e));
    }
  }

  const cancelar = () => setModo({ tipo: "viendo" });

  return (
    <Panel
      titulo={titulo}
      accion={
        modo.tipo === "viendo" && (
          <Button variante="secundario" tamano="sm" onClick={() => setModo({ tipo: "creando" })}>
            {textoAgregar}
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {error && <Alert tipo="error">{error}</Alert>}

        {modo.tipo === "creando" && (
          <Formulario inicial={null} onListo={terminar} onCancelar={cancelar} />
        )}

        {items.length === 0 && modo.tipo !== "creando" && <EmptyState mensaje={textoVacio} />}

        <ul className="flex flex-col gap-3">
          {items.map((item) =>
            modo.tipo === "editando" && modo.id === item.id ? (
              <li key={item.id}>
                <Formulario inicial={item} onListo={terminar} onCancelar={cancelar} />
              </li>
            ) : (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-linea p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">{mostrar(item)}</div>
                <div className="flex shrink-0 flex-wrap items-center gap-4">
                  <Button
                    variante="enlace"
                    onClick={() => setModo({ tipo: "editando", id: item.id })}
                  >
                    Editar
                  </Button>
                  <ConfirmButton
                    pregunta="¿Eliminar?"
                    textoConfirmar="Sí, eliminar"
                    onConfirmar={() => borrar(item.id)}
                  >
                    Eliminar
                  </ConfirmButton>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </Panel>
  );
}

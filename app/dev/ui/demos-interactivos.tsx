"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { TagInput } from "@/components/ui/tag-input";

/**
 * Los componentes que reciben funciones (onCerrar, onConfirmar…) necesitan
 * un componente cliente que las defina: por eso viven en este archivo aparte.
 */
export function DemosInteractivos() {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [cargando, setCargando] = useState(false);

  function simularCarga() {
    setCargando(true);
    setTimeout(() => setCargando(false), 1500);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button cargando={cargando} onClick={simularCarga}>
          Probar estado cargando
        </Button>
        <Button variante="secundario" onClick={() => setDialogoAbierto(true)}>
          Abrir diálogo
        </Button>
        <ConfirmButton
          pregunta="¿Seguro que querés borrar este elemento?"
          textoConfirmar="Sí, borrar"
          onConfirmar={() => setConfirmado(true)}
        >
          Borrar (pide confirmación)
        </ConfirmButton>
      </div>
      {confirmado && <Alert tipo="exito">Se confirmó la acción.</Alert>}

      <Dialog
        abierto={dialogoAbierto}
        titulo="Diálogo de ejemplo"
        onCerrar={() => setDialogoAbierto(false)}
      >
        <p className="text-tinta-suave">
          El foco entra al diálogo al abrirlo, Escape lo cierra y el foco vuelve al botón.
        </p>
      </Dialog>

      <Field label="Habilidades" ayuda="Enter o coma para agregar.">
        {(control) => (
          <TagInput {...control} name="habilidades" inicial={["TypeScript", "React"]} />
        )}
      </Field>

      <Tabs
        etiqueta="Pestañas de ejemplo"
        pestanas={[
          { id: "uno", etiqueta: "Primera", contenido: <p>Contenido de la primera pestaña.</p> },
          {
            id: "dos",
            etiqueta: "Segunda",
            contenido: <p>Con las flechas se cambia de pestaña.</p>,
          },
          { id: "tres", etiqueta: "Tercera", contenido: <p>Home y End van a los extremos.</p> },
        ]}
      />
    </div>
  );
}

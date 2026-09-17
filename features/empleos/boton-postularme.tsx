"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError, mensajeParaUsuario } from "@/lib/api/errores";
import { postularme } from "@/lib/api/empleos";

type Props = { empleoId: string; yaPostulado: boolean };

/** La única parte interactiva del detalle de un empleo. */
export function BotonPostularme({ empleoId, yaPostulado }: Props) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postular() {
    setEnviando(true);
    setError(null);
    try {
      await postularme(empleoId);
      router.refresh();
    } catch (e) {
      // Si ya estaba postulado (por ejemplo, desde otra pestaña), se refresca la vista.
      if (e instanceof ApiError && e.codigo === "YA_POSTULADO") router.refresh();
      else setError(mensajeParaUsuario(e));
    } finally {
      setEnviando(false);
    }
  }

  if (yaPostulado) {
    return <Alert tipo="exito">Ya te postulaste a este empleo.</Alert>;
  }

  return (
    <div className="flex flex-col items-start gap-3">
      {error && <Alert tipo="error">{error}</Alert>}
      <Button cargando={enviando} onClick={postular}>
        Postularme
      </Button>
    </div>
  );
}

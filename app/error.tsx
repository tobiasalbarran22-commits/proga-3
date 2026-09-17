"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { rutas } from "@/lib/rutas";

/**
 * Pantalla para errores inesperados. Next exige que sea un Client Component
 * porque recibe la función `reset` para reintentar.
 */
export default function ErrorGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-tinta">Algo salió mal</h1>
      <p className="max-w-md text-tinta-suave">
        No pudimos cargar esta pantalla. Puede ser un problema momentáneo del servidor.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>Reintentar</Button>
        <ButtonLink href={rutas.inicio} variante="secundario">
          Ir al inicio
        </ButtonLink>
      </div>
    </main>
  );
}

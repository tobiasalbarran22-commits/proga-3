import type { ReactNode } from "react";

/** Contenedor y título de cada pantalla interna. */
export function Pagina({
  titulo,
  bajada,
  children,
}: {
  titulo: string;
  bajada?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance text-tinta">{titulo}</h1>
        {bajada && <p className="mt-2 text-pretty text-tinta-suave">{bajada}</p>}
      </div>
      {children}
    </div>
  );
}

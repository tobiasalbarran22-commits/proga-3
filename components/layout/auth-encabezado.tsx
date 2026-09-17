/** Título y bajada de cada pantalla de autenticación. */
export function AuthEncabezado({ titulo, bajada }: { titulo: string; bajada?: string }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-semibold text-balance text-tinta">{titulo}</h1>
      {bajada && <p className="mt-1.5 text-sm text-pretty text-tinta-suave">{bajada}</p>}
    </div>
  );
}

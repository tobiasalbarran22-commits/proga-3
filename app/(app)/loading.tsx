import { Spinner } from "@/components/ui/spinner";

/**
 * Next lo muestra mientras una página de este grupo pide sus datos.
 * La barra de navegación queda visible porque pertenece al layout.
 */
export default function Cargando() {
  return (
    <div role="status" className="flex justify-center py-20 text-bordo">
      <Spinner className="size-8" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

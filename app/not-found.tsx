import { ButtonLink } from "@/components/ui/button-link";
import { rutas } from "@/lib/rutas";

/**
 * Se muestra para URLs que no existen y también para pantallas a las que
 * el usuario no tiene permiso (ver exigirRol en lib/sesion.ts).
 */
export default function NoEncontrada() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-bold text-bordo">404</p>
      <h1 className="text-2xl font-semibold text-tinta">No encontramos esta página</h1>
      <p className="max-w-md text-tinta-suave">
        Puede que el enlace esté mal escrito o que la página ya no exista.
      </p>
      <ButtonLink href={rutas.inicio}>Ir al inicio</ButtonLink>
    </main>
  );
}

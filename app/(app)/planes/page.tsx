import type { Metadata } from "next";
import { Pagina } from "@/components/layout/pagina";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { rutas } from "@/lib/rutas";
import { exigirRol } from "@/lib/sesion";

export const metadata: Metadata = { title: "Planes" };

export default async function PlanesPage() {
  await exigirRol("TRABAJADOR", "EMPRESA");

  return (
    <Pagina titulo="Planes" bajada="Opciones para destacar tu perfil o tus búsquedas.">
      <EmptyState
        mensaje="Los planes todavía no están disponibles. Mientras tanto, podés usar todas las funciones sin costo."
        accion={
          <ButtonLink href={rutas.empleos} variante="secundario">
            Ver empleos
          </ButtonLink>
        }
      />
    </Pagina>
  );
}

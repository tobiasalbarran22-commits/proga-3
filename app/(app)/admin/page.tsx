import { Pagina } from "@/components/layout/pagina";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Sin metadata propia a propósito: si alguien sin permiso entra acá ve un 404,
 * y un título "Administración" en la pestaña confirmaría que la pantalla existe.
 */
export default function AdminPage() {
  return (
    <Pagina titulo="Administración" bajada="Gestión de usuarios, empresas y búsquedas.">
      <EmptyState mensaje="Las herramientas de administración todavía no están disponibles." />
    </Pagina>
  );
}

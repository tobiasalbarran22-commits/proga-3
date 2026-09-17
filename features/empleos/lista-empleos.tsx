import { EmptyState } from "@/components/ui/empty-state";
import type { Empleo } from "@/types/empleo";
import { TarjetaEmpleo } from "./tarjeta-empleo";

type Props = {
  empleos: Empleo[];
  /** Ids de los empleos a los que el usuario ya se postuló. */
  postulados: Set<string>;
};

export function ListaEmpleos({ empleos, postulados }: Props) {
  if (empleos.length === 0) {
    return <EmptyState mensaje="Por ahora no hay búsquedas publicadas. Volvé a revisar pronto." />;
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {empleos.map((empleo) => (
        <li key={empleo.id} className="flex">
          <TarjetaEmpleo empleo={empleo} yaPostulado={postulados.has(empleo.id)} />
        </li>
      ))}
    </ul>
  );
}

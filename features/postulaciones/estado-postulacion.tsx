import { Badge } from "@/components/ui/badge";
import { ETIQUETA_ESTADO_POSTULACION } from "@/lib/etiquetas";
import type { EstadoPostulacion } from "@/types/enums";

const TONO: Record<EstadoPostulacion, "neutro" | "marca" | "exito" | "aviso"> = {
  ENVIADA: "neutro",
  EN_REVISION: "aviso",
  PRESELECCIONADA: "marca",
  RECHAZADA: "neutro",
  CONTRATADA: "exito",
};

export function EstadoPostulacionBadge({ estado }: { estado: EstadoPostulacion }) {
  return <Badge tono={TONO[estado]}>{ETIQUETA_ESTADO_POSTULACION[estado]}</Badge>;
}

import { Button } from "./button";

type Props = {
  enviando: boolean;
  textoGuardar?: string;
  onCancelar?: () => void;
};

/** Botones al pie de un formulario de edición. */
export function FormActions({ enviando, textoGuardar = "Guardar", onCancelar }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="submit" cargando={enviando}>
        {textoGuardar}
      </Button>
      {onCancelar && (
        <Button variante="secundario" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </Button>
      )}
    </div>
  );
}

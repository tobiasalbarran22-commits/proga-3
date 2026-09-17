import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { rutas } from "@/lib/rutas";

/** Aceptación de términos y consentimiento de datos (proceso 1.3 del DFD). */
export function CampoTerminos({ error }: { error?: string }) {
  return (
    <Checkbox name="aceptaTerminos" error={error}>
      Acepto los{" "}
      <Link href={rutas.terminos} target="_blank" className="font-medium text-bordo underline">
        términos y condiciones
      </Link>{" "}
      y el tratamiento de mis datos personales.
    </Checkbox>
  );
}

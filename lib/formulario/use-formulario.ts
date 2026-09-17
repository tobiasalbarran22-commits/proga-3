import { useState, type FormEvent } from "react";
import type { z } from "zod";
import { mensajeParaUsuario } from "@/lib/api/errores";
import { ErrorDeCampo } from "./errores";
import { leerFormulario } from "./leer-formulario";

export type Errores = Partial<Record<string, string>>;

/** Se queda con el primer error de cada campo. Los que no tienen campo son generales. */
function agruparErrores(error: z.ZodError) {
  const porCampo: Errores = {};
  let general: string | null = null;
  for (const problema of error.issues) {
    const campo = problema.path[0];
    if (campo === undefined) general ??= problema.message;
    else porCampo[String(campo)] ??= problema.message;
  }
  return { porCampo, general };
}

/**
 * Maneja el ciclo completo de un formulario:
 *   leer valores → validar con Zod → mostrar errores o enviar → mostrar el resultado.
 *
 * Los campos NO necesitan un useState cada uno: los valores se leen del
 * <form> al enviarlo (formulario "no controlado").
 *
 * Uso:
 *   const { onSubmit, errores, errorGeneral, enviando } = useFormulario(esquema, async (datos) => {
 *     await guardar(datos);
 *   });
 *   <form onSubmit={onSubmit} noValidate>…</form>
 */
export function useFormulario<T>(esquema: z.ZodType<T>, alEnviar: (datos: T) => Promise<void>) {
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorGeneral(null);

    const resultado = esquema.safeParse(leerFormulario(evento.currentTarget));
    if (!resultado.success) {
      const { porCampo, general } = agruparErrores(resultado.error);
      setErrores(porCampo);
      setErrorGeneral(general);
      return;
    }

    setErrores({});
    setEnviando(true);
    try {
      await alEnviar(resultado.data);
    } catch (error) {
      if (error instanceof ErrorDeCampo) setErrores({ [error.campo]: error.message });
      else setErrorGeneral(mensajeParaUsuario(error));
    } finally {
      setEnviando(false);
    }
  }

  return { onSubmit, errores, errorGeneral, enviando };
}

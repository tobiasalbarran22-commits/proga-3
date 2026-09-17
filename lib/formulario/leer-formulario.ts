/**
 * Lee los valores de un <form> como un objeto plano.
 *
 * Convención: los campos cuyo nombre termina en "[]" siempre se devuelven
 * como lista (sin los corchetes). Así se envían listas de etiquetas con
 * varios <input type="hidden" name="habilidades[]">.
 */
export function leerFormulario(formulario: HTMLFormElement): Record<string, unknown> {
  const datos = new FormData(formulario);
  const resultado: Record<string, unknown> = {};

  for (const nombre of new Set(datos.keys())) {
    if (nombre.endsWith("[]")) {
      resultado[nombre.slice(0, -2)] = datos.getAll(nombre).map(String);
    } else {
      resultado[nombre] = String(datos.get(nombre) ?? "");
    }
  }
  return resultado;
}

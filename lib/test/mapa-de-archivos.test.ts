import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Obliga a mantener docs/mapa-de-archivos.md al día: cada archivo de código
 * tiene que aparecer ahí, y el mapa no puede nombrar archivos que ya no existen.
 */

const RAIZ = join(import.meta.dirname, "..", "..");
const CARPETAS = ["app", "components", "features", "lib", "types", "mocks"];
const EXTENSIONES = /\.(ts|tsx|css)$/;

function archivosDe(carpeta: string): string[] {
  return readdirSync(join(RAIZ, carpeta), { withFileTypes: true }).flatMap((entrada) => {
    // Con "/" a mano (en lugar de join) para que coincida con las rutas de
    // docs/mapa-de-archivos.md también en Windows, donde join usaría "\".
    const ruta = `${carpeta}/${entrada.name}`;
    if (entrada.isDirectory()) return archivosDe(ruta);
    return EXTENSIONES.test(entrada.name) ? [ruta] : [];
  });
}

const mapa = readFileSync(join(RAIZ, "docs", "mapa-de-archivos.md"), "utf8");
const PATRON_RUTA = /`((?:app|components|features|lib|types|mocks)\/[^`]+\.(?:ts|tsx|css))`/g;
const anotados = new Set([...mapa.matchAll(PATRON_RUTA)].flatMap((m) => (m[1] ? [m[1]] : [])));
const existentes = CARPETAS.flatMap(archivosDe);

describe("docs/mapa-de-archivos.md", () => {
  it("anota todos los archivos del proyecto", () => {
    expect(existentes.filter((archivo) => !anotados.has(archivo))).toEqual([]);
  });

  it("no nombra archivos que ya no existen", () => {
    expect([...anotados].filter((archivo) => !existentes.includes(archivo))).toEqual([]);
  });
});

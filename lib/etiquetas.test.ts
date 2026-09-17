import { describe, expect, it } from "vitest";
import { ETIQUETA_MODALIDAD, formatearFecha, formatearUbicacion, opcionesDe } from "./etiquetas";

describe("opcionesDe", () => {
  it("arma una opción por cada valor del enum", () => {
    expect(opcionesDe(ETIQUETA_MODALIDAD)).toContainEqual({ valor: "REMOTA", etiqueta: "Remota" });
    expect(opcionesDe(ETIQUETA_MODALIDAD)).toHaveLength(Object.keys(ETIQUETA_MODALIDAD).length);
  });
});

describe("formatearFecha", () => {
  it("usa el formato argentino", () => {
    expect(formatearFecha("2026-09-15")).toBe("15/09/2026");
    expect(formatearFecha("2026-09-15T10:00:00Z")).toBe("15/09/2026");
  });
});

describe("formatearUbicacion", () => {
  const ubicacion = { paisCodigo: "AR", provincia: "Córdoba", ciudad: "Río Cuarto" };

  it("usa el nombre del país si está en la lista", () => {
    expect(formatearUbicacion(ubicacion, [{ codigo: "AR", nombre: "Argentina" }])).toBe(
      "Río Cuarto, Córdoba, Argentina",
    );
  });

  it("muestra el código si el país no está en la lista", () => {
    expect(formatearUbicacion(ubicacion, [])).toBe("Río Cuarto, Córdoba, AR");
  });
});

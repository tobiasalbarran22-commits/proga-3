import { describe, expect, it } from "vitest";
import { esquemaEducacion, esquemaExperiencia, esquemaHabilidades } from "./esquemas";

const experiencia = {
  empresaNombre: "Globant",
  puesto: "Desarrolladora frontend",
  fechaInicio: "2022-03-01",
  fechaFin: "",
  descripcion: "",
};

describe("esquemaExperiencia", () => {
  it("si es el trabajo actual, no exige fecha de fin y la guarda como null", () => {
    const r = esquemaExperiencia.safeParse({
      ...experiencia,
      esActual: "on",
      fechaFin: "2023-01-01",
    });
    expect(r.success).toBe(true);
    expect(r.data?.fechaFin).toBeNull();
  });

  it("si no es el actual, exige fecha de fin", () => {
    const r = esquemaExperiencia.safeParse(experiencia);
    expect(r.error?.issues[0]?.path).toEqual(["fechaFin"]);
  });

  it("rechaza una fecha de fin anterior a la de inicio", () => {
    const r = esquemaExperiencia.safeParse({ ...experiencia, fechaFin: "2021-01-01" });
    expect(r.success).toBe(false);
  });
});

describe("esquemaEducacion", () => {
  const educacion = {
    institucion: "UTN",
    tituloCarrera: "Ingeniería en Sistemas",
    nivel: "UNIVERSITARIO",
    estado: "EN_CURSO",
    fechaInicio: "2020-03-01",
    fechaFin: "",
  };

  it("acepta una carrera en curso sin fecha de fin", () => {
    const r = esquemaEducacion.safeParse(educacion);
    expect(r.success).toBe(true);
    expect(r.data?.fechaFin).toBeNull();
  });

  it("rechaza un nivel que no está en el diccionario", () => {
    expect(esquemaEducacion.safeParse({ ...educacion, nivel: "DOCTORADO_X" }).success).toBe(false);
  });
});

describe("esquemaHabilidades", () => {
  it("sin habilidades devuelve una lista vacía", () => {
    expect(esquemaHabilidades.parse({})).toEqual({ habilidades: [] });
  });
});

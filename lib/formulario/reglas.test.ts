import { describe, expect, it } from "vitest";
import { cuit, esCuitValido, fechaOpcional, urlOpcional } from "./reglas";

describe("esCuitValido", () => {
  it("acepta un CUIT con dígito verificador correcto", () => {
    expect(esCuitValido("20123456786")).toBe(true);
  });

  it("rechaza un CUIT con dígito verificador incorrecto", () => {
    expect(esCuitValido("20123456780")).toBe(false);
  });

  it("rechaza largos incorrectos", () => {
    expect(esCuitValido("2012345678")).toBe(false);
  });
});

describe("cuit", () => {
  it("ignora guiones al validar", () => {
    expect(cuit.parse("20-12345678-6")).toBe("20123456786");
  });
});

describe("urlOpcional", () => {
  it("convierte vacío en null", () => {
    expect(urlOpcional.parse("  ")).toBeNull();
  });

  it("rechaza protocolos peligrosos", () => {
    expect(urlOpcional.safeParse("javascript:alert(1)").success).toBe(false);
  });
});

describe("fechaOpcional", () => {
  it("acepta vacío o una fecha ISO", () => {
    expect(fechaOpcional.parse("")).toBeNull();
    expect(fechaOpcional.parse("2026-09-15")).toBe("2026-09-15");
  });
});

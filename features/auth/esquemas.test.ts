import { describe, expect, it } from "vitest";
import { esquemaCodigo, esquemaLogin, esquemaRegistroEmpresa } from "./esquemas";

/** Devuelve el primer error de cada campo, igual que useFormulario. */
function errores(resultado: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) {
  return (resultado.error?.issues ?? []).map((i) => String(i.path[0]));
}

const empresaValida = {
  razonSocial: "Estudio Sur SRL",
  identificacionFiscal: "30-71234567-1",
  nombreComercial: "Estudio Sur",
  rubro: "Software",
  descripcion: "Desarrollo de productos digitales.",
  paisCodigo: "AR",
  provincia: "Buenos Aires",
  ciudad: "La Plata",
  email: "rrhh@estudiosur.com",
  contrasena: "segura123",
  confirmacion: "segura123",
  aceptaTerminos: "on",
};

describe("esquemaLogin", () => {
  it("acepta un email y una contraseña", () => {
    expect(esquemaLogin.safeParse({ email: "ana@ejemplo.com", contrasena: "x" }).success).toBe(
      true,
    );
  });

  it("marca el email inválido en su campo", () => {
    const r = esquemaLogin.safeParse({ email: "ana", contrasena: "x" });
    expect(errores(r)).toContain("email");
  });
});

describe("esquemaRegistroEmpresa", () => {
  it("acepta datos completos y deja el CUIT sin guiones", () => {
    const r = esquemaRegistroEmpresa.safeParse(empresaValida);
    expect(r.success).toBe(true);
    expect(r.data?.identificacionFiscal).toBe("30712345671");
    expect(r.data?.aceptaTerminos).toBe(true);
  });

  it("rechaza un CUIT con dígito verificador incorrecto", () => {
    const r = esquemaRegistroEmpresa.safeParse({
      ...empresaValida,
      identificacionFiscal: "30712345670",
    });
    expect(errores(r)).toContain("identificacionFiscal");
  });

  it("marca la confirmación si las contraseñas no coinciden", () => {
    const r = esquemaRegistroEmpresa.safeParse({ ...empresaValida, confirmacion: "otra1234" });
    expect(errores(r)).toEqual(["confirmacion"]);
  });

  it("exige aceptar los términos (una casilla sin marcar no llega)", () => {
    const sinTerminos = { ...empresaValida, aceptaTerminos: undefined };
    expect(errores(esquemaRegistroEmpresa.safeParse(sinTerminos))).toContain("aceptaTerminos");
  });
});

describe("esquemaCodigo", () => {
  it("acepta 6 números", () => {
    expect(esquemaCodigo.safeParse({ codigo: "123456" }).success).toBe(true);
  });

  it("rechaza letras o largos distintos", () => {
    expect(esquemaCodigo.safeParse({ codigo: "12a456" }).success).toBe(false);
    expect(esquemaCodigo.safeParse({ codigo: "12345" }).success).toBe(false);
  });
});

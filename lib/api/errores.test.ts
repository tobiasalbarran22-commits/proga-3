import { describe, expect, it } from "vitest";
import { ApiError, errorDesdeRespuesta, extraerDetalle, mensajeParaUsuario } from "./errores";

describe("extraerDetalle", () => {
  it("devuelve el detail cuando es texto", () => {
    expect(extraerDetalle({ detail: "Email ya registrado" })).toBe("Email ya registrado");
  });

  it("une los mensajes cuando FastAPI manda una lista (error 422)", () => {
    const cuerpo = {
      detail: [
        { loc: ["body", "email"], msg: "email inválido", type: "value_error" },
        { loc: ["body", "password"], msg: "muy corta", type: "value_error" },
      ],
    };
    expect(extraerDetalle(cuerpo)).toBe("email inválido. muy corta");
  });

  it("no rompe con cuerpos inesperados", () => {
    expect(extraerDetalle(null)).toBe("");
    expect(extraerDetalle({ otra: 1 })).toBe("");
  });
});

describe("errorDesdeRespuesta", () => {
  it("usa el código que manda el backend si es conocido", () => {
    const error = errorDesdeRespuesta(400, { detail: "x", code: "EMAIL_REGISTRADO" });
    expect(error.codigo).toBe("EMAIL_REGISTRADO");
  });

  it("deduce el código por el estado HTTP si no viene uno", () => {
    expect(errorDesdeRespuesta(401, {}).codigo).toBe("NO_AUTENTICADO");
    expect(errorDesdeRespuesta(404, {}).codigo).toBe("NO_ENCONTRADO");
    expect(errorDesdeRespuesta(422, { detail: [] }).codigo).toBe("DATOS_INVALIDOS");
  });

  it("ignora códigos que el frontend no conoce", () => {
    expect(errorDesdeRespuesta(500, { code: "ALGO_RARO" }).codigo).toBe("DESCONOCIDO");
  });
});

describe("mensajeParaUsuario", () => {
  it("traduce el código a un texto para el usuario", () => {
    const error = new ApiError(400, "CODIGO_INVALIDO", "detalle técnico");
    expect(mensajeParaUsuario(error)).toBe("El código no es correcto o ya venció.");
  });

  it("tiene un mensaje genérico para errores que no son del backend", () => {
    expect(mensajeParaUsuario(new Error("boom"))).toMatch(/inesperado/);
  });
});

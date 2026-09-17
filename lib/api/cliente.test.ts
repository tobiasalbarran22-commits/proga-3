import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// El cliente distingue navegador de servidor mirando `window`:
// para probar la renovación de sesión simulamos estar en el navegador.
vi.stubGlobal("window", {});
vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");

const { pedir } = await import("./cliente");
const { ApiError } = await import("./errores");

function respuesta(estado: number, cuerpo: unknown = {}) {
  return new Response(JSON.stringify(cuerpo), { status: estado });
}

describe("pedir", () => {
  const fetchFalso = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchFalso.mockReset();
    vi.stubGlobal("fetch", fetchFalso);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.stubGlobal("window", {});
  });

  it("devuelve el cuerpo si la respuesta es exitosa", async () => {
    fetchFalso.mockResolvedValueOnce(respuesta(200, { ok: true }));
    await expect(pedir("/algo")).resolves.toEqual({ ok: true });
    expect(fetchFalso).toHaveBeenCalledWith("http://api.test/algo", expect.anything());
  });

  it("renueva la sesión UNA vez aunque fallen varios pedidos a la vez", async () => {
    fetchFalso.mockImplementation(async (url) => {
      const ruta = String(url);
      if (ruta.endsWith("/refresh")) return respuesta(200);
      const yaRenovo = fetchFalso.mock.calls.some(([u]) => String(u).endsWith("/refresh"));
      return yaRenovo ? respuesta(200, { ruta }) : respuesta(401);
    });

    await Promise.all([pedir("/a"), pedir("/b"), pedir("/c")]);

    const renovaciones = fetchFalso.mock.calls.filter(([u]) => String(u).endsWith("/refresh"));
    expect(renovaciones).toHaveLength(1);
  });

  it("con contraseña incorrecta en /login no intenta renovar la sesión", async () => {
    fetchFalso.mockResolvedValue(respuesta(401, { detail: "x", code: "CREDENCIALES_INVALIDAS" }));

    await expect(pedir("/login", { metodo: "POST" })).rejects.toMatchObject({
      codigo: "CREDENCIALES_INVALIDAS",
    });
    expect(fetchFalso).toHaveBeenCalledTimes(1);
  });

  it("lanza NO_AUTENTICADO si la renovación también falla", async () => {
    fetchFalso.mockResolvedValue(respuesta(401));
    const error = await pedir("/privado").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ codigo: "NO_AUTENTICADO" });
  });

  it("convierte un fallo de red en SIN_CONEXION", async () => {
    fetchFalso.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(pedir("/algo")).rejects.toMatchObject({ codigo: "SIN_CONEXION" });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Usuario } from "@/types/usuario";

// next/navigation corta la ejecución lanzando un error especial: acá se imita eso.
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT ${url}`);
  },
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));
vi.mock("@/lib/api/usuarios", () => ({ obtenerMiUsuario: vi.fn() }));

const { ApiError } = await import("@/lib/api/errores");
const { obtenerMiUsuario } = await import("@/lib/api/usuarios");
const sesion = await import("./sesion");
const consultarBackend = vi.mocked(obtenerMiUsuario);

function usuario(cambios: Partial<Usuario> = {}): Usuario {
  return {
    id: "u-1",
    email: "ana@ejemplo.com",
    tipo: "TRABAJADOR",
    estadoCuenta: "ACTIVA",
    emailVerificado: true,
    ...cambios,
  };
}

// Con llaves: si beforeEach devuelve una función, Vitest la ejecuta como limpieza.
beforeEach(() => {
  consultarBackend.mockReset();
});

describe("obtenerUsuarioActual", () => {
  it("devuelve null si el backend dice que no hay sesión", async () => {
    consultarBackend.mockRejectedValue(new ApiError(401, "NO_AUTENTICADO", ""));
    await expect(sesion.obtenerUsuarioActual()).resolves.toBeNull();
  });

  it("no oculta otros errores (por ejemplo, backend caído)", async () => {
    consultarBackend.mockRejectedValue(new ApiError(0, "SIN_CONEXION", ""));
    await expect(sesion.obtenerUsuarioActual()).rejects.toThrow();
  });
});

describe("exigirUsuarioVerificado", () => {
  it("sin sesión, manda al login", async () => {
    consultarBackend.mockRejectedValue(new ApiError(401, "NO_AUTENTICADO", ""));
    await expect(sesion.exigirUsuarioVerificado()).rejects.toThrow("REDIRECT /login");
  });

  it("con el email sin verificar, manda a verificar la cuenta", async () => {
    consultarBackend.mockResolvedValue(usuario({ emailVerificado: false }));
    await expect(sesion.exigirUsuarioVerificado()).rejects.toThrow("REDIRECT /verificar-cuenta");
  });
});

describe("exigirRol", () => {
  it("con un rol permitido, devuelve el usuario", async () => {
    consultarBackend.mockResolvedValue(usuario());
    await expect(sesion.exigirRol("TRABAJADOR", "EMPRESA")).resolves.toMatchObject({
      tipo: "TRABAJADOR",
    });
  });

  it("con un rol no permitido, muestra 404 (no 'sin permiso')", async () => {
    consultarBackend.mockResolvedValue(usuario());
    await expect(sesion.exigirRol("ADMINISTRADOR")).rejects.toThrow("NOT_FOUND");
  });
});

describe("destinoInicial", () => {
  it("lleva a cada rol a su pantalla", () => {
    expect(sesion.destinoInicial(usuario())).toBe("/empleos");
    expect(sesion.destinoInicial(usuario({ tipo: "ADMINISTRADOR" }))).toBe("/admin");
    expect(sesion.destinoInicial(usuario({ emailVerificado: false }))).toBe("/verificar-cuenta");
  });
});

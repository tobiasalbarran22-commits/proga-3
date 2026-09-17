/**
 * Mini router del backend simulado.
 *
 * Imita el protocolo del backend FastAPI real: rutas, snake_case, cookies
 * HttpOnly y errores con `detail` (+ `code`). Así lib/api no sabe si
 * habla con el real o con este.
 */

import { db } from "./base-de-datos";
import type { UsuarioMock } from "./tipos";

// Tienen que coincidir con COOKIES de lib/config.ts.
const COOKIE_ACCESO = "laburar_token";
const COOKIE_RENOVACION = "laburar_refresh";

/** Latencia simulada, para poder ver los estados de carga en desarrollo. */
const LATENCIA_MS = 250;

export type Contexto = {
  request: Request;
  params: Record<string, string>;
  usuario: UsuarioMock | null;
  cuerpo: () => Promise<Record<string, unknown>>;
};

type Manejador = (ctx: Contexto) => Response | Promise<Response>;

export type Ruta = {
  metodo: "GET" | "POST" | "PUT" | "DELETE";
  patron: string;
  manejador: Manejador;
  /** Por defecto las rutas exigen sesión. */
  publica?: boolean;
};

// ---------- Respuestas ----------

export function responder(datos: unknown, estado = 200, cookies: string[] = []) {
  const cabeceras = new Headers({ "Content-Type": "application/json" });
  cookies.forEach((c) => cabeceras.append("Set-Cookie", c));
  return new Response(JSON.stringify(datos), { status: estado, headers: cabeceras });
}

export function fallar(estado: number, detail: string, code?: string) {
  return responder({ detail, ...(code ? { code } : {}) }, estado);
}

export function exigirCampos(datos: Record<string, unknown>, campos: string[]) {
  const faltantes = campos.filter((c) => datos[c] === undefined || datos[c] === "");
  if (faltantes.length === 0) return null;
  return responder(
    { detail: faltantes.map((c) => ({ loc: ["body", c], msg: `Falta ${c}`, type: "missing" })) },
    422,
  );
}

// ---------- Cookies de sesión ----------

function cookie(nombre: string, valor: string, maxAge: number) {
  return `${nombre}=${valor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function cookiesDeSesion(usuarioId: string) {
  return [
    cookie(COOKIE_ACCESO, `acceso.${usuarioId}`, 60 * 15),
    cookie(COOKIE_RENOVACION, `renovacion.${usuarioId}`, 60 * 60 * 24 * 7),
  ];
}

export const COOKIES_BORRADAS = [cookie(COOKIE_ACCESO, "", 0), cookie(COOKIE_RENOVACION, "", 0)];

function leerCookie(request: Request, nombre: string) {
  const pares = (request.headers.get("cookie") ?? "").split(";").map((p) => p.trim().split("="));
  return pares.find(([clave]) => clave === nombre)?.[1];
}

export function usuarioDesdeCookie(request: Request, tipo: "acceso" | "renovacion") {
  const valor = leerCookie(request, tipo === "acceso" ? COOKIE_ACCESO : COOKIE_RENOVACION);
  const id = valor?.split(".")[1];
  const usuario = db.usuarios.find((u) => u.usuario_id === id);
  return usuario && usuario.estado_cuenta !== "ELIMINADA" ? usuario : null;
}

// ---------- Router ----------

function coincide(patron: string, ruta: string): Record<string, string> | null {
  const partesPatron = patron.split("/").filter(Boolean);
  const partesRuta = ruta.split("/").filter(Boolean);
  if (partesPatron.length !== partesRuta.length) return null;

  const params: Record<string, string> = {};
  for (const [i, parte] of partesPatron.entries()) {
    const valor = partesRuta[i] ?? "";
    if (parte.startsWith(":")) params[parte.slice(1)] = decodeURIComponent(valor);
    else if (parte !== valor) return null;
  }
  return params;
}

async function leerCuerpo(request: Request): Promise<Record<string, unknown>> {
  const tipo = request.headers.get("content-type") ?? "";
  if (tipo.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(await request.text()));
  }
  if (tipo.includes("application/json")) {
    const datos: unknown = await request.json().catch(() => ({}));
    return typeof datos === "object" && datos !== null ? (datos as Record<string, unknown>) : {};
  }
  return {};
}

export async function atender(request: Request, ruta: string, rutas: Ruta[]) {
  await new Promise((resolver) => setTimeout(resolver, LATENCIA_MS));

  for (const definicion of rutas) {
    if (definicion.metodo !== request.method) continue;
    const params = coincide(definicion.patron, ruta);
    if (!params) continue;

    const usuario = usuarioDesdeCookie(request, "acceso");
    if (!definicion.publica && !usuario) return fallar(401, "No autenticado");

    return definicion.manejador({ request, params, usuario, cuerpo: () => leerCuerpo(request) });
  }
  return fallar(404, `No existe ${request.method} ${ruta} en el backend simulado`);
}

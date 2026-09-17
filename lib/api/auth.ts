/**
 * Autenticación: login, registro, verificación de email y recuperación.
 */

import type { Ubicacion } from "@/types/perfil";
import { pedir } from "./cliente";

/** El login de FastAPI (OAuth2PasswordRequestForm) espera un formulario con `username`. */
export async function iniciarSesion(email: string, contrasena: string): Promise<void> {
  await pedir("/login", { metodo: "POST", formulario: { username: email, password: contrasena } });
}

export async function cerrarSesion(): Promise<void> {
  await pedir("/logout", { metodo: "POST" });
}

export async function registrarTrabajador(email: string, contrasena: string): Promise<void> {
  await pedir("/register", {
    metodo: "POST",
    cuerpo: { email, password: contrasena, acepta_terminos: true, tipo_usuario: "TRABAJADOR" },
  });
}

export type DatosRegistroEmpresa = Ubicacion & {
  email: string;
  contrasena: string;
  razonSocial: string;
  identificacionFiscal: string;
  nombreComercial: string;
  descripcion: string;
  rubro: string;
};

function registroEmpresaHaciaApi(d: DatosRegistroEmpresa) {
  return {
    email: d.email,
    password: d.contrasena,
    acepta_terminos: true,
    tipo_usuario: "EMPRESA",
    razon_social: d.razonSocial,
    identificacion_fiscal: d.identificacionFiscal,
    nombre_comercial: d.nombreComercial,
    descripcion_empresa: d.descripcion,
    rubro: d.rubro,
    pais_codigo: d.paisCodigo,
    provincia: d.provincia,
    ciudad: d.ciudad,
  };
}

/** El backend crea la cuenta y el perfil de empresa en la misma operación. */
export async function registrarEmpresa(datos: DatosRegistroEmpresa): Promise<void> {
  await pedir("/register", { metodo: "POST", cuerpo: registroEmpresaHaciaApi(datos) });
}

/** Valida el código de 6 dígitos que llega por mail. Requiere sesión. */
export async function verificarEmail(codigo: string): Promise<void> {
  await pedir("/verify-email", { metodo: "POST", cuerpo: { codigo: Number(codigo) } });
}

export async function reenviarCodigo(): Promise<void> {
  await pedir("/resend-verification", { metodo: "POST" });
}

/** El backend responde igual exista o no el email, para no revelar cuentas. */
export async function pedirRecuperacion(email: string): Promise<void> {
  await pedir("/forgot-password", { metodo: "POST", cuerpo: { email } });
}

export async function restablecerContrasena(token: string, nueva: string): Promise<void> {
  await pedir("/reset-password", { metodo: "POST", cuerpo: { token, new_password: nueva } });
}

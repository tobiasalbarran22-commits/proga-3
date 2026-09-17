import type { EstadoCuenta, TipoUsuario } from "./enums";

/** La cuenta con la que alguien inicia sesión (tabla Usuario). */
export type Usuario = {
  id: string;
  email: string;
  tipo: TipoUsuario;
  estadoCuenta: EstadoCuenta;
  emailVerificado: boolean;
};

export type Pais = {
  codigo: string;
  nombre: string;
};

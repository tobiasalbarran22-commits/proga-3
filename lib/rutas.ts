/**
 * Todas las URLs de la app en un solo lugar.
 * Si una ruta cambia de nombre, se cambia acá y TypeScript avisa el resto.
 */
export const rutas = {
  inicio: "/",
  terminos: "/terminos",

  login: "/login",
  registro: "/registro",
  registroTrabajador: "/registro/trabajador",
  registroEmpresa: "/registro/empresa",
  recuperarContrasena: "/recuperar-contrasena",
  restablecerContrasena: "/restablecer-contrasena",
  verificarCuenta: "/verificar-cuenta",

  perfil: "/perfil",
  empleos: "/empleos",
  empleo: (id: string) => `/empleos/${encodeURIComponent(id)}`,
  postulaciones: "/postulaciones",
  planes: "/planes",
  admin: "/admin",
} as const;

/** Rutas que exigen haber iniciado sesión (las revisa proxy.ts). */
export const PREFIJOS_PRIVADOS = [
  rutas.perfil,
  rutas.empleos,
  rutas.postulaciones,
  rutas.planes,
  rutas.admin,
  rutas.verificarCuenta,
];

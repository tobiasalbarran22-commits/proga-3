import { db, nuevoId } from "./base-de-datos";
import {
  COOKIES_BORRADAS,
  cookiesDeSesion,
  exigirCampos,
  fallar,
  responder,
  usuarioDesdeCookie,
  type Ruta,
} from "./servidor";
import { CODIGO_VERIFICACION_DEMO, TOKEN_RESTABLECER_DEMO } from "./semillas";
import type { UsuarioMock } from "./tipos";

/** Lo que devuelve /users/me: nunca la contraseña. */
function publico(u: UsuarioMock) {
  return {
    usuario_id: u.usuario_id,
    email: u.email,
    tipo_usuario: u.tipo_usuario,
    estado_cuenta: u.estado_cuenta,
    email_verificado: u.email_verificado,
  };
}

export const rutasAuth: Ruta[] = [
  {
    metodo: "POST",
    patron: "/login",
    publica: true,
    manejador: async ({ cuerpo }) => {
      const { username, password } = await cuerpo();
      const usuario = db.usuarios.find((u) => u.email === username && u.password === password);
      if (!usuario || usuario.estado_cuenta === "ELIMINADA") {
        return fallar(401, "Email o contraseña incorrectos", "CREDENCIALES_INVALIDAS");
      }
      if (usuario.estado_cuenta === "SUSPENDIDA") {
        return fallar(403, "Cuenta suspendida", "CUENTA_SUSPENDIDA");
      }
      const token = { access_token: "simulado", token_type: "bearer" };
      return responder(token, 200, cookiesDeSesion(usuario.usuario_id));
    },
  },
  {
    metodo: "POST",
    patron: "/logout",
    publica: true,
    manejador: () => responder({ mensaje: "Sesión cerrada" }, 200, COOKIES_BORRADAS),
  },
  {
    metodo: "POST",
    patron: "/refresh",
    publica: true,
    manejador: ({ request }) => {
      const usuario = usuarioDesdeCookie(request, "renovacion");
      if (!usuario) return fallar(401, "Sesión vencida");
      return responder({ mensaje: "Sesión renovada" }, 200, cookiesDeSesion(usuario.usuario_id));
    },
  },
  {
    metodo: "POST",
    patron: "/register",
    publica: true,
    manejador: async ({ cuerpo }) => {
      const datos = await cuerpo();
      const faltan = exigirCampos(datos, ["email", "password", "tipo_usuario"]);
      if (faltan) return faltan;
      if (db.usuarios.some((u) => u.email === datos.email)) {
        return fallar(400, "El email ya está registrado", "EMAIL_REGISTRADO");
      }
      const esEmpresa = datos.tipo_usuario === "EMPRESA";
      if (
        esEmpresa &&
        db.perfilesEmpresa.some((e) => e.identificacion_fiscal === datos.identificacion_fiscal)
      ) {
        return fallar(400, "La identificación fiscal ya está registrada", "CUIT_REGISTRADO");
      }

      const usuario: UsuarioMock = {
        usuario_id: nuevoId("u"),
        email: String(datos.email),
        password: String(datos.password),
        tipo_usuario: esEmpresa ? "EMPRESA" : "TRABAJADOR",
        estado_cuenta: "PENDIENTE",
        email_verificado: false,
      };
      db.usuarios.push(usuario);

      if (esEmpresa) {
        db.perfilesEmpresa.push({
          empresa_id: nuevoId("emp"),
          usuario_id: usuario.usuario_id,
          razon_social: String(datos.razon_social),
          identificacion_fiscal: String(datos.identificacion_fiscal),
          nombre_comercial: String(datos.nombre_comercial),
          descripcion_empresa: String(datos.descripcion_empresa),
          rubro: String(datos.rubro),
          sitio_web: null,
          logo_url: null,
          pais_codigo: String(datos.pais_codigo),
          provincia: String(datos.provincia),
          ciudad: String(datos.ciudad),
          arca_verificada: false,
        });
      }
      return responder(publico(usuario), 201);
    },
  },
  {
    metodo: "POST",
    patron: "/verify-email",
    manejador: async ({ cuerpo, usuario }) => {
      const { codigo } = await cuerpo();
      if (String(codigo) !== CODIGO_VERIFICACION_DEMO) {
        return fallar(400, "Código inválido", "CODIGO_INVALIDO");
      }
      if (usuario) {
        usuario.email_verificado = true;
        usuario.estado_cuenta = "ACTIVA";
      }
      return responder({ mensaje: "Email verificado" });
    },
  },
  {
    metodo: "POST",
    patron: "/resend-verification",
    manejador: () =>
      responder({ mensaje: `Código reenviado (en el simulador es ${CODIGO_VERIFICACION_DEMO})` }),
  },
  {
    metodo: "POST",
    patron: "/forgot-password",
    publica: true,
    manejador: () => responder({ mensaje: "Si el email existe, te enviamos un enlace" }),
  },
  {
    metodo: "POST",
    patron: "/reset-password",
    publica: true,
    manejador: async ({ cuerpo }) => {
      const { token } = await cuerpo();
      if (token !== TOKEN_RESTABLECER_DEMO) {
        return fallar(400, "Token inválido o vencido", "TOKEN_INVALIDO");
      }
      return responder({ mensaje: "Contraseña actualizada" });
    },
  },
  {
    metodo: "GET",
    patron: "/users/me",
    manejador: ({ usuario }) => responder(usuario && publico(usuario)),
  },
  {
    metodo: "PUT",
    patron: "/users/me",
    manejador: async ({ cuerpo, usuario }) => {
      const datos = await cuerpo();
      if (!usuario || datos.password_actual !== usuario.password) {
        return fallar(400, "La contraseña actual no es correcta", "CONTRASENA_INCORRECTA");
      }
      usuario.password = String(datos.nueva_password);
      return responder(publico(usuario));
    },
  },
  {
    metodo: "DELETE",
    patron: "/users/me",
    manejador: ({ usuario }) => {
      if (usuario) usuario.estado_cuenta = "ELIMINADA";
      return responder({ mensaje: "Cuenta eliminada" }, 200, COOKIES_BORRADAS);
    },
  },
];

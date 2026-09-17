import { db, nuevoId } from "./base-de-datos";
import { exigirCampos, fallar, responder, type Ruta } from "./servidor";
import { PAISES } from "./semillas";
import type { PreferenciaMock } from "./tipos";

type ConUsuario = { usuario_id: string };

/**
 * Genera las 4 rutas de una lista del perfil (educación, experiencia, idiomas).
 * Es el mismo patrón que lib/api/recurso-lista.ts, del lado del "servidor".
 */
function rutasDeLista<T extends ConUsuario>(
  patron: string,
  lista: () => T[],
  campoId: keyof T & string,
  prefijo: string,
  requeridos: string[],
): Ruta[] {
  const buscar = (id: string, usuarioId: string) =>
    lista().find((item) => item[campoId] === id && item.usuario_id === usuarioId);

  return [
    {
      metodo: "GET",
      patron: `${patron}/me`,
      manejador: ({ usuario }) =>
        responder(lista().filter((i) => i.usuario_id === usuario?.usuario_id)),
    },
    {
      metodo: "POST",
      patron,
      manejador: async ({ cuerpo, usuario }) => {
        const datos = await cuerpo();
        const faltan = exigirCampos(datos, requeridos);
        if (faltan) return faltan;
        const nuevo = {
          ...datos,
          [campoId]: nuevoId(prefijo),
          usuario_id: usuario?.usuario_id,
        } as unknown as T;
        lista().push(nuevo);
        return responder(nuevo, 201);
      },
    },
    {
      metodo: "PUT",
      patron: `${patron}/:id`,
      manejador: async ({ cuerpo, params, usuario }) => {
        const item = buscar(params.id ?? "", usuario?.usuario_id ?? "");
        if (!item) return fallar(404, "No encontrado");
        Object.assign(item, await cuerpo());
        return responder(item);
      },
    },
    {
      metodo: "DELETE",
      patron: `${patron}/:id`,
      manejador: ({ params, usuario }) => {
        const item = buscar(params.id ?? "", usuario?.usuario_id ?? "");
        if (!item) return fallar(404, "No encontrado");
        lista().splice(lista().indexOf(item), 1);
        return responder({ mensaje: "Eliminado" });
      },
    },
  ];
}

export const rutasPerfil: Ruta[] = [
  { metodo: "GET", patron: "/paises", publica: true, manejador: () => responder(PAISES) },

  // --- Perfil de trabajador ---
  {
    metodo: "GET",
    patron: "/perfiles-trabajador/me",
    manejador: ({ usuario }) => {
      const perfil = db.perfilesTrabajador.find((p) => p.usuario_id === usuario?.usuario_id);
      return perfil ? responder(perfil) : fallar(404, "El usuario no tiene perfil");
    },
  },
  {
    metodo: "POST",
    patron: "/perfiles-trabajador/",
    manejador: async ({ cuerpo, usuario }) => {
      if (!usuario || usuario.tipo_usuario !== "TRABAJADOR")
        return fallar(403, "Solo trabajadores");
      if (db.perfilesTrabajador.some((p) => p.usuario_id === usuario.usuario_id)) {
        return fallar(400, "El usuario ya posee un perfil", "PERFIL_EXISTENTE");
      }
      const datos = await cuerpo();
      const faltan = exigirCampos(datos, ["nombre", "apellido", "numero_documento"]);
      if (faltan) return faltan;
      const perfil = {
        ...(datos as object),
        perfil_trabajador_id: nuevoId("pt"),
        usuario_id: usuario.usuario_id,
        identidad_verificada: false,
      } as (typeof db.perfilesTrabajador)[number];
      db.perfilesTrabajador.push(perfil);
      return responder(perfil, 201);
    },
  },
  {
    metodo: "PUT",
    patron: "/perfiles-trabajador/me",
    manejador: async ({ cuerpo, usuario }) => {
      const perfil = db.perfilesTrabajador.find((p) => p.usuario_id === usuario?.usuario_id);
      if (!perfil) return fallar(404, "El usuario no tiene perfil");
      Object.assign(perfil, await cuerpo());
      return responder(perfil);
    },
  },

  // --- Perfil de empresa ---
  {
    metodo: "GET",
    patron: "/perfiles-empresa/me",
    manejador: ({ usuario }) => {
      const perfil = db.perfilesEmpresa.find((p) => p.usuario_id === usuario?.usuario_id);
      return perfil ? responder(perfil) : fallar(404, "La empresa no tiene perfil");
    },
  },
  {
    metodo: "PUT",
    patron: "/perfiles-empresa/me",
    manejador: async ({ cuerpo, usuario }) => {
      const perfil = db.perfilesEmpresa.find((p) => p.usuario_id === usuario?.usuario_id);
      if (!perfil) return fallar(404, "La empresa no tiene perfil");
      Object.assign(perfil, await cuerpo());
      return responder(perfil);
    },
  },

  // --- Listas del perfil ---
  ...rutasDeLista("/educaciones", () => db.educaciones, "educacion_id", "edu", [
    "institucion",
    "titulo_carrera",
    "fecha_inicio",
  ]),
  ...rutasDeLista("/experiencias-laborales", () => db.experiencias, "experiencia_id", "exp", [
    "empresa_nombre",
    "puesto",
    "fecha_inicio",
  ]),
  ...rutasDeLista("/idiomas", () => db.idiomas, "idioma_id", "idi", ["idioma", "nivel"]),

  // --- Habilidades y preferencias ---
  {
    metodo: "GET",
    patron: "/habilidades/me",
    manejador: ({ usuario }) =>
      responder({ habilidades: db.habilidades[usuario?.usuario_id ?? ""] ?? [] }),
  },
  {
    metodo: "PUT",
    patron: "/habilidades/me",
    manejador: async ({ cuerpo, usuario }) => {
      const { habilidades } = await cuerpo();
      db.habilidades[usuario?.usuario_id ?? ""] = Array.isArray(habilidades)
        ? habilidades.map(String)
        : [];
      return responder({ habilidades: db.habilidades[usuario?.usuario_id ?? ""] });
    },
  },
  {
    metodo: "GET",
    patron: "/preferencias-laborales/me",
    manejador: ({ usuario }) => {
      const preferencia = db.preferencias[usuario?.usuario_id ?? ""];
      return preferencia ? responder(preferencia) : fallar(404, "Sin preferencias");
    },
  },
  {
    metodo: "PUT",
    patron: "/preferencias-laborales/me",
    manejador: async ({ cuerpo, usuario }) => {
      const datos = (await cuerpo()) as PreferenciaMock;
      db.preferencias[usuario?.usuario_id ?? ""] = datos;
      return responder(datos);
    },
  },
];

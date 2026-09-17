import { db, hoy, nuevoId } from "./base-de-datos";
import { fallar, responder, type Ruta } from "./servidor";
import type { PostulacionMock } from "./tipos";

function nombreDelPostulante(postulacion: PostulacionMock) {
  const perfil = db.perfilesTrabajador.find((p) => p.usuario_id === postulacion.usuario_id);
  const usuario = db.usuarios.find((u) => u.usuario_id === postulacion.usuario_id);
  return {
    postulacion_id: postulacion.postulacion_id,
    nombre_completo: perfil ? `${perfil.nombre} ${perfil.apellido}` : (usuario?.email ?? ""),
    email: usuario?.email ?? "",
    titulo_profesional: perfil?.titulo_profesional ?? null,
    estado: postulacion.estado,
    fecha: postulacion.fecha,
  };
}

export const rutasEmpleos: Ruta[] = [
  { metodo: "GET", patron: "/puestos", manejador: () => responder(db.puestos) },
  {
    metodo: "GET",
    patron: "/puestos/me",
    manejador: ({ usuario }) =>
      responder(db.puestos.filter((p) => p.empresa_id === usuario?.usuario_id)),
  },
  {
    metodo: "GET",
    patron: "/puestos/:id",
    manejador: ({ params }) => {
      const puesto = db.puestos.find((p) => p.puesto_id === params.id);
      return puesto ? responder(puesto) : fallar(404, "Puesto inexistente");
    },
  },
  {
    metodo: "GET",
    patron: "/puestos/:id/postulaciones",
    manejador: ({ params, usuario }) => {
      const puesto = db.puestos.find((p) => p.puesto_id === params.id);
      if (!puesto) return fallar(404, "Puesto inexistente");
      if (puesto.empresa_id !== usuario?.usuario_id) return fallar(403, "No es tu búsqueda");
      const postulaciones = db.postulaciones.filter((p) => p.puesto_id === puesto.puesto_id);
      return responder(postulaciones.map(nombreDelPostulante));
    },
  },
  {
    metodo: "POST",
    patron: "/postulaciones",
    manejador: async ({ cuerpo, usuario }) => {
      if (!usuario || usuario.tipo_usuario !== "TRABAJADOR")
        return fallar(403, "Solo trabajadores");
      const { puesto_id } = await cuerpo();
      if (!db.puestos.some((p) => p.puesto_id === puesto_id))
        return fallar(404, "Puesto inexistente");
      const repetida = db.postulaciones.some(
        (p) => p.puesto_id === puesto_id && p.usuario_id === usuario.usuario_id,
      );
      if (repetida) return fallar(400, "Ya se postuló a este puesto", "YA_POSTULADO");

      const postulacion: PostulacionMock = {
        postulacion_id: nuevoId("post"),
        puesto_id: String(puesto_id),
        usuario_id: usuario.usuario_id,
        estado: "ENVIADA",
        fecha: hoy(),
      };
      db.postulaciones.push(postulacion);
      return responder(postulacion, 201);
    },
  },
  {
    metodo: "GET",
    patron: "/postulaciones/me",
    manejador: ({ usuario }) => {
      const propias = db.postulaciones.filter((p) => p.usuario_id === usuario?.usuario_id);
      return responder(
        propias.map((p) => {
          const puesto = db.puestos.find((x) => x.puesto_id === p.puesto_id);
          return {
            postulacion_id: p.postulacion_id,
            puesto_id: p.puesto_id,
            puesto_titulo: puesto?.titulo ?? "Empleo eliminado",
            empresa_nombre: puesto?.empresa_nombre ?? "",
            estado: p.estado,
            fecha: p.fecha,
          };
        }),
      );
    },
  },
];

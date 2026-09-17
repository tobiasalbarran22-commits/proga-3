import { redirect } from "next/navigation";
import { rutas } from "@/lib/rutas";
import { destinoInicial, obtenerUsuarioActual } from "@/lib/sesion";

/** La raíz no tiene contenido: manda a cada persona a donde le corresponde. */
export default async function Inicio() {
  const usuario = await obtenerUsuarioActual();
  redirect(usuario ? destinoInicial(usuario) : rutas.login);
}

import type { Metadata } from "next";
import { Pagina } from "@/components/layout/pagina";
import { Alert } from "@/components/ui/alert";
import { EducacionSeccion } from "@/features/perfil/educacion-seccion";
import { ExperienciaSeccion } from "@/features/perfil/experiencia-seccion";
import { HabilidadesSeccion } from "@/features/perfil/habilidades-seccion";
import { IdiomasSeccion } from "@/features/perfil/idiomas-seccion";
import { PerfilEmpresaSeccion } from "@/features/perfil/perfil-empresa-seccion";
import { PerfilTrabajadorSeccion } from "@/features/perfil/perfil-trabajador-seccion";
import { PreferenciasSeccion } from "@/features/perfil/preferencias-seccion";
import { SeguridadCuenta } from "@/features/perfil/seguridad-cuenta";
import { educaciones } from "@/lib/api/educacion";
import { experiencias } from "@/lib/api/experiencia";
import { idiomas } from "@/lib/api/idiomas";
import { nuloSiNoExiste } from "@/lib/api/opcional";
import { listarPaisesConRespaldo } from "@/lib/api/paises-con-respaldo";
import { obtenerMiPerfilEmpresa } from "@/lib/api/perfil-empresa";
import { obtenerMiPerfilTrabajador } from "@/lib/api/perfil-trabajador";
import { obtenerMiPreferencia, obtenerMisHabilidades } from "@/lib/api/preferencias";
import { exigirRol } from "@/lib/sesion";
import type { Pais } from "@/types/usuario";

export const metadata: Metadata = { title: "Mi perfil" };

/** El administrador no tiene perfil: para él esta pantalla es un 404. */
export default async function PerfilPage() {
  const usuario = await exigirRol("TRABAJADOR", "EMPRESA");
  const paises = await listarPaisesConRespaldo();

  return usuario.tipo === "TRABAJADOR" ? (
    <PerfilTrabajador email={usuario.email} paises={paises} />
  ) : (
    <PerfilEmpresa email={usuario.email} paises={paises} />
  );
}

type Props = { email: string; paises: Pais[] };

async function PerfilTrabajador({ email, paises }: Props) {
  const perfil = await obtenerMiPerfilTrabajador();

  // Sin perfil creado, las demás secciones no tienen a qué asociarse:
  // primero se completa el perfil.
  if (!perfil) {
    return (
      <Pagina titulo="Mi perfil" bajada="Completá tus datos para empezar a postularte.">
        <div className="flex flex-col gap-6">
          <PerfilTrabajadorSeccion perfil={null} paises={paises} />
          <SeguridadCuenta email={email} />
        </div>
      </Pagina>
    );
  }

  // Los pedidos son independientes: se hacen en paralelo.
  // Idiomas y habilidades todavía no existen en el backend (ver docs/backend.md):
  // mientras tanto, un 404 se muestra como lista vacía para no romper todo el perfil.
  const [listaEducacion, listaExperiencia, listaIdiomas, habilidades, preferencia] =
    await Promise.all([
      educaciones.listar(),
      experiencias.listar(),
      nuloSiNoExiste(idiomas.listar()).then((lista) => lista ?? []),
      nuloSiNoExiste(obtenerMisHabilidades()).then((lista) => lista ?? []),
      obtenerMiPreferencia(),
    ]);

  return (
    <Pagina titulo="Mi perfil" bajada="Esto es lo que ven las empresas cuando te postulás.">
      <div className="flex flex-col gap-6">
        <PerfilTrabajadorSeccion perfil={perfil} paises={paises} />
        <ExperienciaSeccion items={listaExperiencia} />
        <EducacionSeccion items={listaEducacion} />
        <HabilidadesSeccion habilidades={habilidades} />
        <IdiomasSeccion items={listaIdiomas} />
        <PreferenciasSeccion preferencia={preferencia} />
        <SeguridadCuenta email={email} />
      </div>
    </Pagina>
  );
}

async function PerfilEmpresa({ email, paises }: Props) {
  const perfil = await obtenerMiPerfilEmpresa();

  return (
    <Pagina titulo="Mi empresa" bajada="Estos datos se muestran en tus búsquedas publicadas.">
      <div className="flex flex-col gap-6">
        {perfil ? (
          <PerfilEmpresaSeccion perfil={perfil} paises={paises} />
        ) : (
          // El perfil de empresa se crea al registrarse; si falta, es un problema del backend.
          <Alert tipo="error">
            No encontramos los datos de tu empresa. Escribinos para que lo revisemos.
          </Alert>
        )}
        <SeguridadCuenta email={email} />
      </div>
    </Pagina>
  );
}

import type { Metadata } from "next";
import { AuthEncabezado } from "@/components/layout/auth-encabezado";
import { AuthFooterLink } from "@/components/layout/auth-footer-link";
import { RegistroTrabajadorForm } from "@/features/auth/registro-trabajador-form";
import { listarPaisesConRespaldo } from "@/lib/api/paises-con-respaldo";
import { rutas } from "@/lib/rutas";

export const metadata: Metadata = { title: "Registro de trabajador" };

export default async function RegistroTrabajador() {
  const paises = await listarPaisesConRespaldo();
  return (
    <>
      <AuthEncabezado titulo="Crear cuenta de trabajador" />
      <RegistroTrabajadorForm paises={paises} />
      <AuthFooterLink
        texto="¿Representás a una empresa? "
        href={rutas.registroEmpresa}
        enlace="Registrala acá"
      />
    </>
  );
}

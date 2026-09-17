import type { Metadata } from "next";
import { AuthEncabezado } from "@/components/layout/auth-encabezado";
import { AuthFooterLink } from "@/components/layout/auth-footer-link";
import { RegistroEmpresaForm } from "@/features/auth/registro-empresa-form";
import { listarPaisesConRespaldo } from "@/lib/api/paises-con-respaldo";
import { rutas } from "@/lib/rutas";

export const metadata: Metadata = { title: "Registro de empresa" };

export default async function RegistroEmpresa() {
  const paises = await listarPaisesConRespaldo();
  return (
    <>
      <AuthEncabezado titulo="Crear cuenta de empresa" />
      <RegistroEmpresaForm paises={paises} />
      <AuthFooterLink
        texto="¿Buscás trabajo? "
        href={rutas.registroTrabajador}
        enlace="Registrate como trabajador"
      />
    </>
  );
}

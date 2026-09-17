import type { Metadata } from "next";
import Link from "next/link";
import { rutas } from "@/lib/rutas";

export const metadata: Metadata = { title: "Términos y condiciones" };

const PARRAFOS = [
  "Para utilizar laburAR, es necesario aceptar los Términos y Condiciones de la plataforma y prestar consentimiento para el tratamiento de tus datos personales.",
  "La información proporcionada será utilizada exclusivamente para gestionar tu cuenta, perfil, búsquedas laborales, postulaciones, verificaciones, notificaciones y demás funcionalidades de laburAR. El tratamiento de estos datos se realizará conforme a la Ley 25.326 de Protección de Datos Personales.",
  "Cuando corresponda, algunos datos podrán ser verificados mediante servicios externos como RENAPER o ARCA, y los pagos podrán ser procesados por proveedores externos.",
  "Las empresas son responsables de la información y de las ofertas laborales que publiquen. No se permiten publicaciones falsas, fraudulentas, ilegales o discriminatorias.",
  "En caso de utilizar planes o servicios pagos, también serán aplicables la Ley 24.240 de Defensa del Consumidor y las disposiciones correspondientes del Código Civil y Comercial de la Nación.",
  "laburAR funciona como una plataforma de intermediación entre trabajadores y empresas y no garantiza la contratación de un trabajador ni la selección de un candidato.",
  "Podés solicitar la actualización, rectificación o eliminación de tus datos personales cuando corresponda, conforme a la normativa vigente.",
];

export default function Terminos() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <Link href={rutas.inicio} className="text-sm font-medium text-bordo hover:underline">
        Volver a laburAR
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-tinta">Términos y condiciones</h1>

      <div className="mt-6 flex flex-col gap-4 leading-relaxed text-tinta-suave">
        {PARRAFOS.map((parrafo) => (
          <p key={parrafo.slice(0, 30)}>{parrafo}</p>
        ))}
        <p className="mt-4 border-t border-linea pt-4 text-sm italic">
          Al registrarte, confirmás que leíste y aceptás los Términos y Condiciones de laburAR y que
          prestás tu consentimiento para el tratamiento de tus datos personales conforme a la
          Política de Privacidad y a la Ley 25.326 de Protección de Datos Personales.
        </p>
      </div>
    </main>
  );
}

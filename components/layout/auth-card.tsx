import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { rutas } from "@/lib/rutas";

/**
 * Fondo y tarjeta de las pantallas de autenticación.
 *
 * El video solo se muestra en pantallas medianas o grandes y si la persona
 * no pidió reducir el movimiento. En el resto de los casos queda la imagen
 * fija (poster), que pesa mucho menos.
 */
export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh items-center justify-center px-4 py-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url(/imagenes/fondo-auth.jpg)] bg-cover bg-center"
      />
      <video
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden size-full object-cover motion-reduce:hidden md:block"
        src="/videos/fondo-auth.mp4"
        poster="/imagenes/fondo-auth.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />

      <main className="w-full max-w-lg rounded-2xl bg-fondo/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
        <Link href={rutas.inicio} className="mx-auto mb-6 block w-fit rounded-full">
          <Image src="/logo.png" alt="laburAR, ir al inicio" width={64} height={64} priority />
        </Link>
        {children}
      </main>
    </div>
  );
}

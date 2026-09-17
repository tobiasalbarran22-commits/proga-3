import type { Metadata } from "next";
import type { ReactNode } from "react";
// Fuente Inter servida desde el propio proyecto (sin pedir nada a Google).
// El navegador descarga solo los caracteres que usa la página (unicode-range).
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "laburAR", template: "%s · laburAR" },
  description: "Bolsa de trabajo de tecnología para Argentina.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}

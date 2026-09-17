import Link from "next/link";

type Props = { texto?: string; href: string; enlace: string };

/** Línea al pie de una pantalla de acceso, para pasar a la pantalla relacionada (login ↔ registro). */
export function AuthFooterLink({ texto, href, enlace }: Props) {
  return (
    <p className="mt-6 text-center text-sm text-tinta-suave">
      {texto}
      <Link href={href} className="font-semibold text-bordo hover:underline">
        {enlace}
      </Link>
    </p>
  );
}

/** Enlace que abre en otra pestaña. Si no hay URL, no muestra nada. */
export function EnlaceExterno({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-bordo underline"
    >
      {url}
    </a>
  );
}

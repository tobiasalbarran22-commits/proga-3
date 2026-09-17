"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cerrarSesion } from "@/lib/api/auth";
import { rutas } from "@/lib/rutas";

export function BotonSalir({ texto = "Cerrar sesión" }: { texto?: string }) {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  async function salir() {
    setSaliendo(true);
    // Aunque el backend no responda, la persona quiere salir: se la lleva al login igual.
    await cerrarSesion().catch(() => undefined);
    router.replace(rutas.login);
    router.refresh();
  }

  return (
    <Button variante="secundario" tamano="sm" cargando={saliendo} onClick={salir}>
      {texto}
    </Button>
  );
}

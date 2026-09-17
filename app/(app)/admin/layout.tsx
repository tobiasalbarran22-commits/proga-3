import type { ReactNode } from "react";
import { exigirRol } from "@/lib/sesion";

/** Todo lo que cuelga de /admin exige rol administrador. Si no lo tiene, ve un 404. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await exigirRol("ADMINISTRADOR");
  return children;
}

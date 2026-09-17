import type { Pais } from "@/types/usuario";

/**
 * Lista que se usa si el backend no responde al pedir los países,
 * para que el registro no quede bloqueado. Mismos códigos ISO que el backend.
 */
export const PAISES_RESPALDO: Pais[] = [
  { codigo: "AR", nombre: "Argentina" },
  { codigo: "BO", nombre: "Bolivia" },
  { codigo: "BR", nombre: "Brasil" },
  { codigo: "CL", nombre: "Chile" },
  { codigo: "CO", nombre: "Colombia" },
  { codigo: "EC", nombre: "Ecuador" },
  { codigo: "ES", nombre: "España" },
  { codigo: "US", nombre: "Estados Unidos" },
  { codigo: "MX", nombre: "México" },
  { codigo: "PY", nombre: "Paraguay" },
  { codigo: "PE", nombre: "Perú" },
  { codigo: "UY", nombre: "Uruguay" },
  { codigo: "VE", nombre: "Venezuela" },
];

// Allies Section - Constants
// Datos para la sección "Nuestros aliados"
import type { StaticImageData } from "next/image";
import fifteenFifteen from "@shared/assets/allies/1551.webp";
import CBP from "@shared/assets/allies/CBP.webp";
import proInnovate from "@shared/assets/allies/proInnovate.webp";
import starUp from "@shared/assets/allies/starUp.webp";

export interface AllyLogo {
  id: string;
  src: StaticImageData;
  alt: string;
}

export const ALLIES_LOGOS: AllyLogo[] = [
  // Fila 1
  { id: "1551-1", src: fifteenFifteen, alt: "1551 Incubadora de Empresas Innovadoras" },
  { id: "cbp-1", src: CBP, alt: "Colegio de Biólogos del Perú" },
  { id: "pro-1", src: proInnovate, alt: "PRO Innovate" },
  { id: "startup-1", src: starUp, alt: "STARTUP PERÚ" },
  { id: "pro-2", src: proInnovate, alt: "PRO Innovate" },
  
  // Fila 2
  { id: "pro-3", src: proInnovate, alt: "PRO Innovate" },
  { id: "1551-2", src: fifteenFifteen, alt: "1551 Incubadora de Empresas Innovadoras" },
  { id: "startup-2", src: starUp, alt: "STARTUP PERÚ" },
  { id: "pro-4", src: proInnovate, alt: "PRO Innovate" },
  { id: "cbp-2", src: CBP, alt: "Colegio de Biólogos del Perú" },
  
  // Fila 3
  { id: "cbp-3", src: CBP, alt: "Colegio de Biólogos del Perú" },
  { id: "1551-3", src: fifteenFifteen, alt: "1551 Incubadora de Empresas Innovadoras" },
  { id: "pro-5", src: proInnovate, alt: "PRO Innovate" },
  { id: "pro-6", src: proInnovate, alt: "PRO Innovate" },
  { id: "startup-3", src: starUp, alt: "STARTUP PERÚ" },
] as const;


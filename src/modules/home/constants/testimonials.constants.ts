// Testimonials Section - Constants
// Datos para la sección "Testimonios"
import test1 from "@shared/assets/testimonials/test-1.webp";
import { StaticImageData } from "next/image";

export interface Testimonial {
  id: string;
  quote: string;
  highlightedText: string;
  author: string;
  role: string;
  affiliation: string;
  image: string | StaticImageData;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "maria-jones",
    quote: "Los nuevos conocimientos adquiridos me ayudaron a mejorar mis procesos científicos en ",
    highlightedText: "30% del tiempo.",
    author: "María Jones",
    role: "Estudiante",
    affiliation: "UNMSM",
    image: test1,
  },
  {
    id: "carlos-rodriguez",
    quote: "Los casos reales me permitieron aplicar de inmediato lo aprendido en ",
    highlightedText: "mi investigación actual.",
    author: "Carlos Rodríguez",
    role: "Investigador",
    affiliation: "Universidad Nacional",
    image: test1,
  },
  {
    id: "ana-martinez",
    quote: "El apoyo de los expertos y la calidad del contenido superaron mis expectativas, logrando mejorar ",
    highlightedText: "mi productividad científica en un 40%.",
    author: "Ana Martínez",
    role: "Profesional",
    affiliation: "Instituto de Investigación",
    image: test1,
  },
] as const;


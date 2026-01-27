// Experts Section - Constants
// Datos para la sección "Conoce a nuestros expertos"
import type { StaticImageData } from "next/image";
import member1 from "@shared/assets/members/member-1.webp";
import member2 from "@shared/assets/members/member-2.webp";
import member3 from "@shared/assets/members/member-3.webp";
import member4 from "@shared/assets/members/member-4.webp";

export interface Expert {
  id: string;
  name: string;
  title: string;
  image: string | StaticImageData;
  links?: {
    linkedin?: string;
    orcid?: string;
    researchGate?: string;
  };
}

export const EXPERTS: Expert[] = [
  {
    id: "miguel-torres",
    name: "Dr. Miguel Torres",
    title: "Líder en Ciencias Biomédicas",
    image: member1,
    links: {
      linkedin: "#",
      orcid: "#",
      researchGate: "#",
    },
  },
  {
    id: "andres-vega",
    name: "Dr. Andrés Vega",
    title: "Experto en Capacitación Práctica",
    image: member2,
    links: {
      linkedin: "#",
      orcid: "#",
      researchGate: "#",
    },
  },
  {
    id: "carlos-ramos",
    name: "Dr. Carlos Ramos",
    title: "Director de Innovación Científica",
    image: member3,
    links: {
      linkedin: "#",
      orcid: "#",
      researchGate: "#",
    },
  },
  {
    id: "laura-mendoza",
    name: "Ing. Laura Mendoza",
    title: "Especialista en Programas Educativos",
    image: member4,
    links: {
      linkedin: "#",
      orcid: "#",
      researchGate: "#",
    },
  },
] as const;


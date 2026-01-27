// News Section - Constants
// Datos para la sección "Noticias recientes"
import type { StaticImageData } from "next/image";
import notice1 from "@shared/assets/notices/notice-1.webp";
import notice2 from "@shared/assets/notices/notice-2.webp";
import notice3 from "@shared/assets/notices/notice-3.webp";

export interface NewsTag {
  label: string;
  color: string;
  textColor?: string;
}

export interface NewsItem {
  id: string;
  image: StaticImageData;
  date: string;
  title: string;
  description: string;
  tags: NewsTag[];
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-1",
    image: notice1,
    date: "16 enero, 2026",
    title: "Fundamentos de Biología Molecular",
    description: "Explora procesos celulares con ADN y proteínas.",
    tags: [
      { label: "Biología", color: "#FCE7F3", textColor: "#BE185D" }, // Rosa claro con texto rosa oscuro
      { label: "Química", color: "#D1FAE5", textColor: "#065F46" }, // Verde claro con texto verde oscuro
    ],
  },
  {
    id: "news-2",
    image: notice2,
    date: "16 enero, 2026",
    title: "Equipo de Expertos",
    description: "Profesionales en ciencias que inspiran excelencia.",
    tags: [
      { label: "Educación", color: "#FCE7F3", textColor: "#BE185D" }, // Rosa claro con texto rosa oscuro
      { label: "Expertos", color: "#DBEAFE", textColor: "#1E40AF" }, // Azul claro con texto azul oscuro
    ],
  },
  {
    id: "news-3",
    image: notice3,
    date: "16 enero, 2026",
    title: "Avances en Ingeniería Biomédica",
    description: "Innovaciones en dispositivos médicos y diagnóstico.",
    tags: [
      { label: "Biología", color: "#E9D5FF", textColor: "#6B21A8" }, // Morado claro con texto morado oscuro
      { label: "Ingeniería", color: "#DBEAFE", textColor: "#1E40AF" }, // Azul claro con texto azul oscuro
      { label: "Biotecnología", color: "#FCE7F3", textColor: "#BE185D" }, // Rosa claro con texto rosa oscuro
    ],
  },
] as const;


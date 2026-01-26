// About Module - Types
// Definiciones de tipos TypeScript para el módulo About

export interface LearningGridItem {
  order: number;
  heading: string;
  highlightText?: string;
  description: string;
  BtnText?: string;
  BtnLink?: string;
}

export interface StatItem {
  count: string;
  label: string;
}


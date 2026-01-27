// Home Module Types
import type { Course } from "../../catalog/types";

export interface CategoryWithCourses {
  name: string;
  description?: string;
  courses: Course[];
}

export interface CatalogPageData {
  selectedCategory?: CategoryWithCourses;
  differentCategory?: CategoryWithCourses;
  mostSellingCourses?: Course[];
}

export interface HomeProps {
  courses: Course[];
  token: string | null;
  coursesLoading?: boolean;
  coursesError?: boolean;
}

export type { Course };

export interface CTAButtonType {
  active: boolean;
  linkto?: string;
  link?: string;
  btnText: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  linkto?: string;
}

export interface HighlightTextProps {
  text: string;
}

export interface ConcentricCirclesProps {
  /** Tamaño del círculo más grande en píxeles */
  size?: number;
  /** Número de círculos concéntricos (por defecto 4) */
  circles?: number;
  /** Color del borde de los círculos */
  borderColor?: string;
  /** Color del punto decorativo */
  dotColor?: string;
  /** Mostrar punto decorativo */
  showDot?: boolean;
  /** Tamaño del punto decorativo en píxeles */
  dotSize?: number;
  /** Clases CSS adicionales */
  className?: string;
  /** Clases CSS adicionales para el círculo pequeño (dot) */
  dotClassName?: string;
  /** Estilos inline adicionales */
  style?: React.CSSProperties;
}
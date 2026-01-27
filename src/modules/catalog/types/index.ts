// Catalog Module Types

export interface Review {
  rating?: number;
  ratingValue?: number;
  [key: string]: unknown;
}

export interface Course {
  id?: string;  // UUID del backend PostgreSQL
  _id?: string; // Mantener compatibilidad si se usa
  courseName: string;
  price: number;
  thumbnail: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  ratingAndReviews?: Review[] | unknown[];
  studentsEnrolled?: unknown[];
  totalDuration?: number; // Duración total en segundos
  averageRating?: number; // Rating promedio del backend
  totalReviews?: number; // Total de reseñas
  totalStudentsEnrolled?: number; // Total de estudiantes inscritos
  reviews?: Review[]; // Campo alternativo para reviews
  ratings?: Review[]; // Campo alternativo para ratings
  createdAt?: string; // Para filtrar por fecha
  updatedAt?: string;
}

export interface Category {
  id?: string;  // UUID del backend PostgreSQL
  _id?: string; // Mantener compatibilidad si se usa
  name: string;
}

export interface CategoryWithCourses {
  name: string;
  description?: string;
  courses: Course[];
}

export interface CatalogSectionsProps {
  catalogPageData: CatalogPageData;
}

export interface CatalogTabsProps {
  catalogPageData: CatalogPageData;
  active: number;
  onTabChange: (tab: number) => void;
}

export interface CatalogPageData {
  selectedCategory: CategoryWithCourses;
  differentCategory: CategoryWithCourses;
  mostSellingCourses: Course[];
}

export interface CourseCardProps {
  course: Course;
  Height: string;
}

export interface CourseSliderProps {
  Courses: Course[];
}

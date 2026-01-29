// Courses Module Types

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
    name: string;
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
  id?: string;
  _id?: string;
  name: string;
}

export interface CoursesProps {
  courses: Course[];
  categories: Category[];
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  onPageChange?: (page: number) => void;
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  loading?: boolean;
  error?: boolean;
}

// Courses Module Types

export interface Review {
  rating?: number;
  ratingValue?: number;
  [key: string]: unknown;
}

export interface Course {
  id?: string;
  courseName: string;
  courseDescription: string;
  price: number;
  thumbnail: string;
  instructor: {
    name: string;
    professional_title: string;
  };
  category: {
    name: string;
  };
  ratingAndReviews?: Review[] | unknown[];
  studentsEnrolled?: unknown[];
  totalDuration?: number;
  averageRating?: number;
  totalReviews?: number;
  totalStudentsEnrolled?: number;
  reviews?: Review[];
  ratings?: Review[];
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

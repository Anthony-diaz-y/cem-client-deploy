// Catalog Module Types

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
  ratingAndReviews: unknown[];
  studentsEnrolled: unknown[];
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

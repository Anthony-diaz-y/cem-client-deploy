// Catalog Module Types

export interface Course {
  _id: string;
  courseName: string;
  price: number;
  thumbnail: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  ratingAndReviews: unknown[];
  studentsEnrolled: unknown[];
}

export interface Category {
  _id: string;
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

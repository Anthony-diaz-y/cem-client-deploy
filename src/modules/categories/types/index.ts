/** Domain and Category types for the category selection system */

export interface CoursePreview {
  id: string;
  courseName: string;
  courseDescription: string;
  instructorId: string;
  whatYouWillLearn: string;
  price: string;
  priceUSD?: string | number;
  thumbnail: string;
  totalDuration: string | null;
  instructor?: {
    id: string;
    name: string;
    image?: string;
    additionalDetails?: {
      professional_title: string;
    };
  };
  categoryId: string;
  category?: {
    id: string;
    name: string;
    type?: "career" | "sector";
  }[];
  tag: string[];
  instructions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  courses: CoursePreview[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogGroup {
  id: string;
  name: string;
  description: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

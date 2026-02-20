/** Domain and Category types for the category selection system */

export interface CoursePreview {
  id: string;
  courseName: string;
  courseDescription: string;
  instructorId: string;
  whatYouWillLearn: string;
  price: string;
  thumbnail: string;
  totalDuration: string | null;
  categoryId: string;
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

export interface Domain {
  id: string;
  name: string;
  description: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

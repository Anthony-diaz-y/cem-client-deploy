export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface UpdateCategoryRequest {
  categoryId: string;
  name: string;
  description: string;
}

export interface UpdateCategoryResponse {
  success: boolean;
  message: string;
  data?: {
    category: {
      id: string;
      name: string;
      description: string;
    };
  };
}

export interface GetAllCategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface GetPublicCategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
  data?: Category[];
  details?: string;
  category?: {
    id: string;
    name: string;
    totalCourses: number;
  };
  courses?: Array<{
    numero: number;
    id: string;
    nombre: string;
    estado: string;
    instructor: string;
  }>;
  actionRequired?: string;
}

export interface GetCategoryCoursesRequest {
  categoryId: string;
}

export interface GetCategoryCoursesResponse {
  success: boolean;
  message: string;
  data: {
    category: {
      id: string;
      name: string;
      description: string;
    };
    courses: Array<{
      id: string;
      courseName: string;
      status: "Published" | "Draft";
      instructor: {
        id: string;
        name: string;
        email: string;
      };
      createdAt: string;
    }>;
    totalCourses: number;
  };
}

export interface ChangeCourseCategoryRequest {
  courseId: string;
  newCategoryId: string;
}

export interface ChangeCourseCategoryResponse {
  success: boolean;
  message: string;
  data: {
    course: {
      id: string;
      courseName: string;
      category: {
        id: string;
        name: string;
      };
    };
  };
}

export interface ChangeMultipleCoursesCategoryRequest {
  changes: Array<{
    courseId: string;
    newCategoryId: string;
  }>;
}

export interface ChangeMultipleCoursesCategoryResponse {
  success: boolean;
  message: string;
  data: {
    successful: Array<{
      courseId: string;
      success: boolean;
      data: {
        course: {
          id: string;
          courseName: string;
          category: {
            id: string;
            name: string;
          };
        };
      };
    }>;
    failed: Array<{
      courseId: string;
      error: string;
    }>;
    total: number;
    successfulCount: number;
    failedCount: number;
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  accountType: string;
  active: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  contactNumber?: string | null;
  additionalDetails?: {
    dateOfBirth?: string | null;
    gender?: string | null;
    about?: string | null;
    contactNumber?: string | null;
  };
}

export interface StudentFilters {
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AllStudentsResponse {
  success: boolean;
  data: {
    all: Student[];
    active: Student[];
    inactive: Student[];
  };
  message: string;
  counts: {
    total: number;
    active: number;
    inactive: number;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StudentCourse {
  id: string;
  courseName: string;
  thumbnail: string;
  progressPercentage: number;
  enrolledAt: string;
  completed: boolean;
  category?: {
    name: string;
  };
}

export interface StudentStatistics {
  enrolledCourses: number;
  completedCourses: number;
  averageProgress: number;
  totalTimeSpent?: number;
}

export interface StudentDetailsResponse {
  success: boolean;
  data: {
    student: Student;
    statistics: StudentStatistics;
    enrolledCourses: StudentCourse[];
  };
  message: string;
}

export interface UpdateStudentData {
  name?: string;
  email?: string;
  contactNumber?: string | number | null;
  active?: boolean;
}

export interface UpdateStudentResponse {
  success: boolean;
  message: string;
  data: Student;
}

export interface ToggleStudentStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    active: boolean;
  };
}

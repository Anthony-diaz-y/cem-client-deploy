export interface Instructor {
  id: string;
  name: string;
  email: string;
  accountType: string;
  approved: boolean;
  active?: boolean;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  additionalDetails?: {
    gender?: string | null;
    dateOfBirth?: string | null;
    about?: string | null;
    contactNumber?: string | null;
  };
  profile?: {
    id: string;
    gender?: string | null;
    dateOfBirth?: string | null;
    about?: string | null;
    contactNumber?: number | null;
  };
}

export interface InstructorFilters {
  status?: "approved" | "pending" | "all";
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PendingInstructorsResponse {
  success: boolean;
  data: Instructor[];
  message: string;
  count: number;
}

export interface AllInstructorsResponse {
  success: boolean;
  data: {
    all: Instructor[];
    approved: Instructor[];
    pending: Instructor[];
    active?: Instructor[];
    inactive?: Instructor[];
  };
  message: string;
  counts: {
    total: number;
    approved: number;
    pending: number;
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

export interface InstructorStatistics {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface InstructorCourse {
  id: string;
  courseName: string;
  status: "Published" | "Draft";
  price: number;
  totalStudents: number;
  revenue: number;
  averageRating: number;
  totalReviews: number;
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

export interface InstructorDetailsResponse {
  success: boolean;
  data: {
    instructor: Instructor;
    statistics: InstructorStatistics;
    courses: InstructorCourse[];
  };
  message: string;
}

export interface UpdateInstructorData {
  name?: string;
  email?: string;
  approved?: boolean;
  contactNumber?: number | string | null;
}

export interface UpdateInstructorResponse {
  success: boolean;
  message: string;
  data: Instructor;
}

export interface ToggleInstructorStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    active: boolean;
  };
}

export interface ApproveInstructorResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    approved: boolean;
  };
}

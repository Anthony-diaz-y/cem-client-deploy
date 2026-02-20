/**
 * Tipos compartidos para las APIs de administración
 */

// ================ Dashboard Types ================
// ================ Dashboard Types ================
export interface AdminDashboardCounts {
  totalInstructors: number;
  approvedInstructors: number;
  pendingInstructors: number;
  totalStudents: number;
  unreadMessages: number;
}

export interface AdminDashboardRevenue {
  total: number;
  period: string;
}

export interface AdminDashboardCharts {
  topCoursesByStudents: Array<{
    id: string;
    courseName: string;
    thumbnail: string;
    studentsCount: number;
  }>;
  topCoursesByRevenue: Array<{
    id: string;
    courseName: string;
    thumbnail: string;
    revenue: number;
  }>;
}

export interface AdminDashboardData {
  counts: AdminDashboardCounts;
  revenue: AdminDashboardRevenue;
  charts: AdminDashboardCharts;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
  message: string;
}

// Legacy type support alias if needed, though we should update consumers
export type AdminDashboardStats = AdminDashboardCounts;

// ================ Instructor Types ================
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
    professional_title?: string | null;
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
  professional_title?: string | null;
}

export interface UpdateInstructorResponse {
  success: boolean;
  message: string;
  data: Instructor;
}

export interface CreateInstructorData {
  name: string;
  email: string;
  password?: string;
  contactNumber?: string | number;
  professional_title?: string;
}

export interface CreateInstructorResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    accountType: string;
    approved: boolean;
    tempPassword?: string;
  };
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

// ================ Student Types ================
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

// ================ Course Types ================
export interface CourseInstructor {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
}

export interface AdminCourse {
  id: string;
  courseName: string;
  courseDescription: string;
  price: number;
  thumbnail?: string;
  status: "Draft" | "Published";
  createdAt: string;
  updatedAt: string;
  instructor: CourseInstructor;
  instructors?: CourseInstructor[];
  category: CourseCategory | CourseCategory[];
  totalStudentsEnrolled?: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface PendingCoursesResponse {
  success: boolean;
  data: AdminCourse[];
  message: string;
  count: number;
}

export interface AllCoursesResponse {
  success: boolean;
  data: AdminCourse[];
  message: string;
  count: number;
  counts?: {
    total: number;
    published: number;
    draft: number;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PublishCourseResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

export interface EditCourseResponse {
  success: boolean;
  message: string;
  data: AdminCourse;
}

export interface DeleteCourseResponse {
  success: boolean;
  message: string;
}

export interface CourseDetailsCourseInfo {
  id: string;
  courseName: string;
  courseDescription: string;
  whatYouWillLearn: string;
  price: number;
  thumbnail: string;
  status: "Draft" | "Published";
  tag: string[];
  instructions: string[];
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    image: string;
    accountType: "Instructor" | "Admin";
  };
  instructors?: {
    id: string;
    name: string;
    email: string;
    image: string;
    accountType: "Instructor" | "Admin";
  }[];
  category: {
    id: string;
    name: string;
    description: string;
  } | null;
}

export interface CourseDetailsStatistics {
  totalStudentsEnrolled: number;
  totalSubSections: number;
  totalSections: number;
  averageProgressPercentage: number;
  studentsCompleted: number;
  studentsInProgress: number;
  studentsNotStarted: number;
  totalDiscussions: number;
  totalDiscussionReplies: number;
  averageRating: number;
  totalReviews: number;
}

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  image: string;
  enrolledAt: string | null;
  progress: {
    completedSubSections: number;
    totalSubSections: number;
    progressPercentage: number;
    isCompleted: boolean;
    completedVideosIds: string[];
  };
}

export interface DiscussionReply {
  id: string;
  reply: string;
  userId: string;
  userName: string;
  userAccountType: "Admin" | "Instructor" | "Student";
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionBySubSection {
  subSectionId: string;
  subSectionTitle: string;
  sectionName: string;
  totalQuestions: number;
  totalReplies: number;
  lastActivity: string | null;
  discussions: Array<{
    id: string;
    question: string;
    userId: string;
    userName: string;
    userAccountType: "Admin" | "Instructor" | "Student";
    repliesCount: number;
    createdAt: string;
    updatedAt: string;
    replies: DiscussionReply[];
  }>;
}

export interface CourseReview {
  id: string;
  rating: number;
  review: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailsData {
  course: CourseDetailsCourseInfo;
  statistics: CourseDetailsStatistics;
  enrolledStudents: EnrolledStudent[];
  discussionsBySubSection: DiscussionBySubSection[];
  reviews?: CourseReview[];
  editCourseEndpoint: string;
  courseId: string;
}

export interface CourseDetailsResponse {
  success: boolean;
  data: CourseDetailsData;
  message: string;
}

// ================ Category Types ================
export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  domain?: {
    id: string;
    name: string;
  } | null;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  icon?: string;
  domainId?: string;
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
  icon?: string;
  domainId?: string;
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

// ================ Review Types ================
export interface CreateReviewRequest {
  courseId: string;
  rating: number;
  review: string;
}

export interface UpdateReviewRequest {
  rating: number;
  review: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: CourseReview;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    rating: number;
    review: string;
    userId: string;
    courseId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

// ================ Global Search Types ================
export interface GlobalSearchResult {
  students: Student[];
  instructors: Instructor[];
  courses: AdminCourse[];
}

export interface GlobalSearchResponse {
  success: boolean;
  message: string;
  data: GlobalSearchResult;
  counts: {
    students: number;
    instructors: number;
    courses: number;
    total: number;
  };
}

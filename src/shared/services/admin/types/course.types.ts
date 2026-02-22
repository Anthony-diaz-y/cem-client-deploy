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
    accountType: "Instructor";
  };
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

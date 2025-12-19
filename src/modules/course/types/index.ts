// Course Module Types
import type { ConfirmationModalData } from "@shared/components/ConfirmationModal";

export interface CourseAuthorSectionProps {
  instructor: Course["instructor"] & {
    additionalDetails?: {
      about?: string;
    };
  };
}

export interface CourseContentSectionProps {
  response: CourseDetailsResponse;
  totalNoOfLectures: number;
  isActive: string[];
  handleActive: (id: string) => void;
  onCollapseAll: () => void;
}

export interface CourseHeroProps {
  course: Course & {
    _id: string | string[];
    instructor: Course["instructor"] & {
      additionalDetails?: {
        about?: string;
      };
    };
  };
  avgReviewCount: number;
  onBuyCourse: () => void;
  onAddToCart: () => void;
}

export interface CourseInfoSectionProps {
  whatYouWillLearn: string;
  tag: string[];
}

export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

export interface Section {
  _id: string;
  sectionName: string;
  subSection: SubSection[];
}

export interface SubSection {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  timeDuration?: string;
}

export interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  instructor: Instructor;
  whatYouWillLearn: string;
  courseContent: Section[];
  ratingAndReviews: Review[];
  price: number;
  thumbnail: string;
  tag: string[];
  category: Category;
  studentsEnrolled: string[];
  instructions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  rating: number;
  review: string;
  course: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

// Cart Types
export interface CartItem {
  id?: string;  // UUID del backend PostgreSQL
  _id?: string; // Mantener compatibilidad si se usa
  courseName: string;
  price: number;
  thumbnail: string;
  instructor: Instructor;
  courseDescription?: string;
  category?: {
    name: string;
  };
  ratingAndReviews?: Review[];
  averageRating?: number | string; // Rating promedio del backend
  totalReviews?: number; // Total de reseñas
}

export interface CartState {
  cart: CartItem[];
  total: number;
  totalItems: number;
}

// Payment Types
export interface UserDetails {
  firstName: string;
  email: string;
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentData extends PaymentResponse {
  coursesId: string[];
}

// API Error Types
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// API Request Types
export type CourseFormData = FormData;

export interface SectionData {
  sectionName: string;
  courseId: string;
  sectionId?: string;
}

export interface SubSectionData {
  sectionId: string;
  subSectionId?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  [key: string]: unknown;
}

export interface DeleteSectionData {
  sectionId: string;
  courseId: string;
}

export interface DeleteSubSectionData {
  subSectionId: string;
  sectionId: string;
}

export interface DeleteCourseData {
  courseId: string;
}

export interface LectureCompletionData {
  courseId: string;
  subSectionId: string;
}

export interface RatingData {
  courseId: string;
  rating: number;
  review: string;
}

// Component Props Types
export interface CourseDetailsCardProps {
  course: Pick<
    Course,
    | "_id"
    | "thumbnail"
    | "price"
    | "courseName"
    | "studentsEnrolled"
    | "instructions"
    | "instructor"
  >;
  setConfirmationModal: React.Dispatch<
    React.SetStateAction<ConfirmationModalData | null>
  >;
  handleBuyCourse: () => void;
}

export interface CourseAccordionBarProps {
  course: Section;
  isActive: string[];
  handleActive: (id: string) => void;
}

// Course Details Response Type
export interface CourseDetailsResponse {
  success: boolean;
  data: {
    courseDetails: Course & {
      _id: string | string[];
      instructor: Instructor & {
        additionalDetails?: {
          about?: string;
        };
      };
    };
    totalDuration: string;
  };
}

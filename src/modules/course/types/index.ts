// Course Module Types
import type { ConfirmationModalData } from "@shared/components";

export interface CourseAuthorSectionProps {
  instructor?: Instructor;
  instructors?: Instructor[];
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
    instructor?: Instructor;
    instructors?: Instructor[];
  };
  avgReviewCount: number;
  onBuyCourse?: () => void;
  onAddToCart?: () => void;
}

export interface CourseInfoSectionProps {
  whatYouWillLearn: string;
  categories: Category[];
}

export interface Instructor {
  _id?: string;
  id?: string; // Add id for compatibility
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  name?: string;
  professional_title?: string;
  additionalDetails?: {
    about?: string;
    professional_title?: string;
    biography?: string;
    linkedin?: string;
    orcid?: string;
    cti_vitae?: string;
  };
  links?: {
    orcid?: string;
    researchGate?: string;
    linkedin?: string;
  };
  active?: boolean; // Add active
  approved?: boolean; // Add approved
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
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  content?: string;
}

export interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  instructor?: Instructor;
  instructors?: Instructor[]; // Add instructors array
  whatYouWillLearn: string;
  courseContent: Section[];
  ratingAndReviews: Review[];
  price: number;
  priceUSD?: number;
  thumbnail: string;
  tag?: string[];
  category: Category | Category[];
  studentsEnrolled: string[];
  instructions: string[];
  promoVideoUrl?: string;
  syllabus?: string;
  status: string;
  totalDuration?: string | number;
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
  id?: string; // UUID del backend PostgreSQL
  _id?: string; // Mantener compatibilidad si se usa
  courseName: string;
  price: number;
  thumbnail: string;
  instructor?: Instructor;
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

export interface BuyNowTemporaryResponse {
  success: boolean;
  message: string;
  warning?: string;
}

// API Error Types
export interface ApiError {
  response?: {
    status?: number;
    statusText?: string;
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
  attachments?: File[];
  content?: string;
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
    | "priceUSD"
    | "courseName"
    | "studentsEnrolled"
    | "instructions"
    | "instructor"
    | "promoVideoUrl"
    | "syllabus"
  >;
  setConfirmationModal: React.Dispatch<
    React.SetStateAction<ConfirmationModalData | null>
  >;
  handleBuyCourse: () => void;
  handleAddToCart: () => void;
  isEnrolled?: boolean;
}

export interface CourseAccordionBarProps {
  course: Section;
  isActive: string[];
  handleActive: (id: string) => void;
  id?: string;
}

// Course Details Response Type
export interface CourseDetailsResponse {
  success: boolean;
  message?: string;
  data: {
    courseDetails: Course & {
      _id: string | string[];
      instructor: Instructor;
    };
    totalDuration: string;
    isEnrolled?: boolean;
  };
}

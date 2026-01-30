// Course Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type {
  Course,
  Section,
  SubSection,
  Instructor,
  Review,
  Category,
  CartItem,
  CartState,
  UserDetails,
  PaymentResponse,
  VerifyPaymentData,
  ApiError,
  CourseFormData,
  SectionData,
  SubSectionData,
  DeleteSectionData,
  DeleteSubSectionData,
  DeleteCourseData,
  LectureCompletionData,
  RatingData,
  CourseDetailsCardProps,
  CourseAccordionBarProps,
  CourseHeroProps,
  CourseInfoSectionProps,
} from "./types";

// Constants
export { COURSE_TEXTS } from "./constants/course.constants";

// Hooks
export { useCourseDetails } from "./hooks/useCourseDetails";
export { useCourseCalculations } from "./hooks/useCourseCalculations";
export { useCourseActions } from "./hooks/useCourseActions";
export { useCourseReviews } from "./hooks/useCourseReviews";

// Services
export * from "./services/courseDetailsAPI";
export * from "./services/studentFeaturesAPI";
export {
  createRating,
  updateRating,
  getReviews,
  getUserReview,
  getRatingStats,
  type Review as ReviewType,
  type CreateRatingData,
  type UpdateRatingData,
  type ReviewsResponse,
  type RatingStats as RatingStatsType,
} from "./services/reviewsAPI";

// Store
export { default as courseReducer } from "./store/courseSlice";
export { default as cartReducer } from "./store/cartSlice";

// Components - Organized by feature
export * from "./components";

// Containers
export { default as CourseDetailsContainer } from "./containers/CourseDetailsContainer";

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
} from './types'

// Constants
export { COURSE_TEXTS } from './constants/course.constants'

// Hooks
export { useCourseDetails } from './hooks/useCourseDetails'
export { useCourseCalculations } from './hooks/useCourseCalculations'
export { useCourseActions } from './hooks/useCourseActions'
export { useCourseReviews } from './hooks/useCourseReviews'

// Services
export * from './services/courseDetailsAPI'
export * from './services/studentFeaturesAPI'
export * from './services/reviewsAPI'

// Store
export { default as courseReducer } from './store/courseSlice'
export { default as cartReducer } from './store/cartSlice'

// Components
export { default as CourseAccordionBar } from './components/CourseAccordionBar'
export { default as CourseDetailsCard } from './components/CourseDetailsCard'
export { default as CourseSubSectionAccordion } from './components/CourseSubSectionAccordion'
export { default as CourseHero } from './components/CourseHero'
export { default as CourseInfoSection } from './components/CourseInfoSection'
export { default as CourseContentSection } from './components/CourseContentSection'
export { default as CourseAuthorSection } from './components/CourseAuthorSection'
export { default as CourseLoadingSkeleton } from './components/CourseLoadingSkeleton'
export { default as RatingStats } from './components/RatingStats'
export { default as ReviewForm } from './components/ReviewForm'
export { default as CourseReviews } from './components/CourseReviews'

// Containers
export { default as CourseDetailsContainer } from './containers/CourseDetailsContainer'

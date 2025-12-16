// Course Module - Public API

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
  CourseAccordionBarProps
} from './types'

// Components
export { default as CourseAccordionBar } from './components/CourseAccordionBar'
export { default as CourseDetailsCard } from './components/CourseDetailsCard'
export { default as CourseSubSectionAccordion } from './components/CourseSubSectionAccordion'

// Services
export * from './services/courseDetailsAPI'
export * from './services/studentFeaturesAPI'

// Store
export { default as courseReducer } from './store/courseSlice'
export { default as cartReducer } from './store/cartSlice'

// Container
export { default as CourseDetailsContainer } from './containers/CourseDetailsContainer'

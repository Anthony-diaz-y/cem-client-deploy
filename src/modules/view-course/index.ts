// View Course Module - Public API

// Types
export type {
  ViewCourseState,
  CompletedLecture,
  Section,
  SubSection,
  Course,
} from "./types";

// Constants
export { VIEW_COURSE_TEXTS } from "./constants/viewCourse.constants";

// Components
export { default as VideoDetails } from "./components/VideoDetails";
export { default as VideoDetailsSidebar } from "./components/VideoDetailsSidebar";
export { default as VideoDetailsReviewModal } from "./components/VideoDetailsReviewModal";

// Hooks
export { useSidebarState } from "./hooks/useSidebarState";
export { useVideoNavigation } from "./hooks/useVideoNavigation";
export { useVideoPlayer } from "./hooks/useVideoPlayer";

// Services
export * from "./services/discussionAPI";

// Store
export { default as viewCourseReducer } from "./store/viewCourseSlice";

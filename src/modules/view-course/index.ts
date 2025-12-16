// View Course Module - Public API

// Types
export type { ViewCourseState, CompletedLecture, Section, SubSection, Course } from './types';

// Components
export { default as VideoDetails } from './components/VideoDetails';
export { default as VideoDetailsSidebar } from './components/VideoDetailsSidebar';
export { default as VideoDetailsReviewModal } from './components/VideoDetailsReviewModal';

// Store
export { default as viewCourseReducer } from './store/viewCourseSlice';

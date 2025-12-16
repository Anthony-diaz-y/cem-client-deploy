// Dashboard Module - Public API
// This module now re-exports from the new modular structure for backward compatibility

// Types
export type { ConfirmationModalData, SidebarLinkProps } from './types';

// Dashboard Shared Components (Sidebar, etc.)
export { default as Sidebar } from './components/Sidebar';
export { default as SidebarLink } from './components/SidebarLink';
export { default as sidebarReducer } from './store/sidebarSlice';

// Profile
export { MyProfile } from '../profile';

// Settings
export {
  Settings,
  ChangeProfilePicture,
  DeleteAccount,
  EditProfile,
  UpdatePassword
} from '../settings';

// Student
export { EnrolledCourses, MyCourses } from '../student';

// Add Course
export { AddCourse } from '../add-course';

// Cart
export { Cart, RenderCartCourses, RenderTotalAmount } from '../cart';

// Instructor
export {
  Instructor,
  InstructorChart,
  CoursesTable,
  EditCourse,
  InstructorCourses // Explicitly added to replace implicit export
} from '../instructor';

// Services - Re-export from new modules
export * from '../settings';
export * from '../profile';
export { fetchInstructorCourses, deleteCourse } from '../instructor';

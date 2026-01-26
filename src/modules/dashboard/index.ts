// Dashboard Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type { ConfirmationModalData, SidebarLinkProps } from "./types";

// Constants
export { DASHBOARD_TEXTS } from "./constants/dashboard.constants";

// Store
export { default as sidebarReducer } from "./store/sidebarSlice";
export { setOpenSideMenu, setScreenSize, setCourseViewSidebar, setDiscussionSidebarOpen } from "./store/sidebarSlice";

// Components
export { default as Sidebar } from "./components/Sidebar";
export { default as SidebarLink } from "./components/SidebarLink";

// Re-exports from other modules (for backward compatibility)
// Profile
export { MyProfile } from "../profile";

// Settings
export {
  Settings,
  ChangeProfilePicture,
  DeleteAccount,
  EditProfile,
  UpdatePassword,
} from "../settings";

// Student
export { EnrolledCourses, MyCourses } from "../student";

// Add Course
export { AddCourse } from "../add-course";

// Cart
export { Cart, RenderCartCourses, RenderTotalAmount } from "../cart";

// Instructor
export {
  Instructor,
  InstructorChart,
  CoursesTable,
  EditCourse,
  InstructorCourses,
} from "../instructor";

// Services - Re-export from new modules
export * from "../settings";
export * from "../profile";
export { fetchInstructorCourses, deleteCourse } from "../instructor";

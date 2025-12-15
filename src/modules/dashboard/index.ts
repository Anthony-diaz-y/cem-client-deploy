// Dashboard Module - Public API

// Main components
export { default as Sidebar } from './components/Sidebar';
export { default as SidebarLink } from './components/SidebarLink';

// Profile
export { default as MyProfile } from './profile/components/MyProfile';

// Settings
export { default as Settings } from './settings/components/Settings';
export { default as ChangeProfilePicture } from './settings/components/ChangeProfilePicture';
export { default as DeleteAccount } from './settings/components/DeleteAccount';
export { default as EditProfile } from './settings/components/EditProfile';
export { default as UpdatePassword } from './settings/components/UpdatePassword';

// Courses
export { default as MyCourses } from './courses/components/MyCourses';
export { default as EnrolledCourses } from './courses/components/EnrolledCourses';
export { default as CourseTable } from './courses/components/CourseTable';

// Add Course
export { default as AddCourse } from './courses/add-course/components/AddCourse';

// Cart
export { default as Cart } from './cart/components/Cart';
export { default as RenderCartCourses } from './cart/components/RenderCartCourses';
export { default as RenderTotalAmount } from './cart/components/RenderTotalAmount';

// Instructor
export { default as Instructor } from './instructor/components/Instructor';
export { default as InstructorChart } from './instructor/components/InstructorChart';

// Services
export * from './settings/services/SettingsAPI';
export * from './profile/services/profileAPI';
export * from './instructor/services/InstructorDashboardAPI';

// Store
export { default as sidebarReducer } from './store/sidebarSlice';

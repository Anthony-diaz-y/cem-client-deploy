// Student Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type { Course, Section, SubSection } from "./types";

// Constants
export { STUDENT_TEXTS } from "./constants/student.constants";

// Components
export { default as EnrolledCourses } from "./components/EnrolledCourses";
export { default as MyCourses } from "./components/MyCourses";

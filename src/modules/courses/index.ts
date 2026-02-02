// Courses Module - Public API

// Types
export type { Course } from "./types";

// Hooks
export { useCoursesData } from "./hooks/useCoursesData";

// Services
export { getCourses } from "./services/coursesAPI";

// Utils
export { formatDurationForBadge } from "./utils";

// Components (Only CoursesList used externally now)
export { CoursesListSection } from "./components/coursesList";

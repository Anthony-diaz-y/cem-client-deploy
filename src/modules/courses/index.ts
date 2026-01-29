// Courses Module - Public API

// Types
export type {
  CoursesProps,
  Category,
} from "./types";

export type { Course } from "./types";

// Hooks
export { useCoursesData } from "./hooks/useCoursesData";

// Services
export { getCategories, getCourses } from "./services/coursesAPI";

// Utils
export { formatDurationForBadge } from "./utils";

// Components
export { CategoriesSection } from "./components/categories";
export { CoursesListSection } from "./components/coursesList";

// Containers
export { default as CoursesContainer } from "./containers/CoursesContainer";

// Presentational Component
export { default as Courses } from "./Courses";

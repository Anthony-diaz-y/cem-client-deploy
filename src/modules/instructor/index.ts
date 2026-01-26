// Instructor Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type {
  InstructorDataType,
  Course,
  CoursesTableProps,
  ConfirmationModalData,
  InstructorChartProps,
  InstructorStatsProps,
  InstructorCoursesGridProps,
} from "./types";

// Constants
export { INSTRUCTOR_TEXTS } from "./constants/instructor.constants";

// Hooks
export { useInstructorData } from "./hooks/useInstructorData";
export { useInstructorStats } from "./hooks/useInstructorStats";
export { useSkeletonLoading } from "./hooks/useSkeletonLoading";

// Services
export * from "./services/InstructorDashboardAPI";
export { fetchInstructorCourses, deleteCourse } from "./services/InstructorDashboardAPI";

// Components
export { default as InstructorChart } from "./components/InstructorChart";
export { default as CoursesTable } from "./components/CoursesTable";
export { default as InstructorStats } from "./components/InstructorStats";
export { default as InstructorCoursesGrid } from "./components/InstructorCoursesGrid";
export { default as InstructorEmptyState } from "./components/InstructorEmptyState";
export { default as InstructorLoadingSkeleton } from "./components/InstructorLoadingSkeleton";

// Containers
export { default as Instructor } from "./containers/Instructor";
export { default as EditCourse } from "./containers/EditCourse";
export { default as InstructorCourses } from "./containers/InstructorCourses";

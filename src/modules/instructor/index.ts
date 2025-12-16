// My Courses Module (Instructor Dashboard) - Public API

// Types
export type {
  InstructorDataType,
  Course,
  CoursesTableProps,
  ConfirmationModalData,
} from "./types";

// Components
export { default as Instructor } from "./containers/Instructor";
export { default as InstructorChart } from "./components/InstructorChart";
export { default as CoursesTable } from "./components/CoursesTable";
export { default as EditCourse } from "./containers/EditCourse";
export { default as InstructorCourses } from "./containers/InstructorCourses";

// Services
export * from "./services/InstructorDashboardAPI";

// Container (to be created)
// export { default as MyCoursesContainer } from './containers/MyCoursesContainer';

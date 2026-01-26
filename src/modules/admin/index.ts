// Admin Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types (re-exported from components)
export type { CategoryModalProps, CourseItem } from "./components/category/types";

// Containers
export { default as AdminDashboard } from "./containers/AdminDashboard";
export { default as AdminEditCourse } from "./containers/AdminEditCourse";
export { default as AllCoursesContainer } from "./containers/AllCoursesContainer";
export { default as AllInstructorsContainer } from "./containers/AllInstructorsContainer";
export { default as AllScheduledClassesContainer } from "./containers/AllScheduledClassesContainer";
export { default as AllStudentsContainer } from "./containers/AllStudentsContainer";
export { default as CategoriesContainer } from "./containers/CategoriesContainer";
export { default as ContactMessagesContainer } from "./containers/ContactMessagesContainer";
export { default as CourseDetailsContainer } from "./containers/CourseDetailsContainer";
export { default as PendingCoursesContainer } from "./containers/PendingCoursesContainer";

// Components - Category
export { default as CategoriesTable } from "./components/category/CategoriesTable";
export { default as CreateCategoryModal } from "./components/category/CreateCategoryModal";
export { default as EditCategoryModal } from "./components/category/EditCategoryModal";
export { default as DeleteCategoryModal } from "./components/category/DeleteCategoryModal";
export { default as DeleteAllCoursesModal } from "./components/category/DeleteAllCoursesModal";
export { default as DeleteCourseModal } from "./components/category/DeleteCourseModal";

// Components - Course
export { default as AllCoursesTable } from "./components/course/AllCoursesTable";
export { default as CourseCard } from "./components/course/CourseCard";
export { default as CourseFilters } from "./components/course/CourseFilters";
export { default as EditCourseModal } from "./components/course/EditCourseModal";
export { default as PendingCoursesTable } from "./components/course/PendingCoursesTable";
export { default as ReviewsList } from "./components/course/ReviewsList";
export { default as StatisticsCards } from "./components/course/StatisticsCards";
export { default as StudentsTable } from "./components/course/StudentsTable";

// Components - Scheduled Classes
export { default as AdminClassCard } from "./components/scheduled-classes/AdminClassCard";
export { default as AdminClassFilters } from "./components/scheduled-classes/AdminClassFilters";
export { default as ClassStatisticsCards } from "./components/scheduled-classes/ClassStatisticsCards";

// Components - Instructor
export { default as AllInstructorsTable } from "./components/instructor/AllInstructorsTable";
export { default as PendingInstructorsTable } from "./components/instructor/PendingInstructorsTable";

// Components - Shared
export { default as AdminStats } from "./components/stats/AdminStats";
export { default as CustomDropdown } from "./components/dropdown/CustomDropdown";

// Hooks (optional exports for advanced usage)
export { useCategories } from "./hooks/category/useCategories";
export { useAdminCourses } from "./hooks/course/useAdminCourses";
export { useAdminInstructors } from "./hooks/instructor/useAdminInstructors";
export { useAdminClasses } from "./hooks/useAdminClasses";

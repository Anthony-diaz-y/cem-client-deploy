// Catalog Module - Public API

// Types
export type {
  Course,
  Category,
  CategoryWithCourses,
  CatalogPageData,
  CourseCardProps,
  CourseSliderProps,
} from "./types";

// Components
export { default as CourseCard } from "./components/CourseCard";
export { default as CourseSlider } from "./components/CourseSlider";

// Container
export { default as CatalogContainer } from "./containers/CatalogContainer";

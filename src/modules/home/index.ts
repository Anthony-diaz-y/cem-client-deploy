// Home Module - Public API

// Types
export type {
  HomeProps,
  CatalogPageData,
  CategoryWithCourses,
  Course,
  CTAButtonType,
  CodeBlocksProps,
  ButtonProps,
  HighlightTextProps,
  ExploreCourseCard,
  HomePageExploreItem,
  CourseCardProps,
  TimelineItem,
} from "./types";

// Components
export { default as Button } from "./components/Button";
export { default as CodeBlocks } from "./components/CodeBlocks";
export { default as CourseCard } from "./components/CourseCard";
export { default as ExploreMore } from "./components/ExploreMore";
export { default as HighlightText } from "./components/HighlightText";
export { default as InstructorSection } from "./components/InstructorSection";
export { default as LearningLanguageSection } from "./components/LearningLanguageSection";
export { default as TimelineSection } from "./components/TimelineSection";

// Container
export { default as HomeContainer } from "./containers/HomeContainer";

// Presentational Component
export { default as Home } from "./Home";

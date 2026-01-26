// Home Module - Public API
// Scream Modular Architecture: Feature-based organization

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

// Constants
export { HOME_TEXTS } from "./constants/home.constants";

// Hooks
export { useHomeBackground } from "./hooks/useHomeBackground";
export { useHomeCatalogData } from "./hooks/useHomeCatalogData";
export { useHomeLinks } from "./hooks/useHomeLinks";

// Components
export { default as Button } from "./components/Button";
export { default as CodeBlocks } from "./components/CodeBlocks";
export { default as CourseCard } from "./components/CourseCard";
export { default as ExploreMore } from "./components/ExploreMore";
export { default as HighlightText } from "./components/HighlightText";
export { default as InstructorSection } from "./components/InstructorSection";
export { default as LearningLanguageSection } from "./components/LearningLanguageSection";
export { default as TimelineSection } from "./components/TimelineSection";

// Containers
export { default as HomeContainer } from "./containers/HomeContainer";

// Presentational Component
export { default as Home } from "./Home";

// Home Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type {
  HomeProps,
  CatalogPageData,
  CategoryWithCourses,
  Course,
  CTAButtonType,
  ButtonProps,
  HighlightTextProps,
} from "./types";

// Constants
export { HOME_TEXTS } from "./constants/home.constants";

// Hooks
export { useHomeCatalogData } from "./hooks/useHomeCatalogData";
export { useCombinedCourses } from "./hooks/useCombinedCourses";

// Components
export { Button, HighlightText } from "./components/shared";

// Containers
export { default as HomeContainer } from "./containers/HomeContainer";

// Presentational Component
export { default as Home } from "./Home";

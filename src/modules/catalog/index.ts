// Catalog Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type {
  Course,
  Category,
  CategoryWithCourses,
  CatalogPageData,
  CourseCardProps,
  CourseSliderProps,
} from "./types";

// Constants
export { CATALOG_TEXTS } from "./constants/catalog.constants";

// Hooks
export { useCatalogData } from "./hooks/useCatalogData";
export { useCatalogTabs } from "./hooks/useCatalogTabs";
export { useCatalogTabsFilter } from "./hooks/useCatalogTabsFilter";
export type { UseCatalogTabsFilterReturn } from "./hooks/useCatalogTabsFilter";
export { useCatalogSections } from "./hooks/useCatalogSections";
export type { UseCatalogSectionsReturn } from "./hooks/useCatalogSections";

// Components
export { default as CourseCard } from "./components/CourseCard";
export { default as CourseSlider } from "./components/CourseSlider";
export { default as CatalogHero } from "./components/CatalogHero";
export { default as CatalogTabs } from "./components/CatalogTabs";
export { default as CatalogSections } from "./components/CatalogSections";
export { default as CatalogLoadingState } from "./components/CatalogLoadingState";
export { default as CatalogEmptyState } from "./components/CatalogEmptyState";

// Containers
export { default as CatalogContainer } from "./containers/CatalogContainer";

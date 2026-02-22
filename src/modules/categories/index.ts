/** Categories Module - Public API */

// Types
export type { CatalogGroup, Category, CoursePreview } from "./types";

// Services
export { getCatalogGroups } from "./services/catalogAPI";

// Components
export { default as CategorySelectionPage } from "./components/CategorySelectionPage";
export { default as CategoryCard } from "./components/CategoryCard";

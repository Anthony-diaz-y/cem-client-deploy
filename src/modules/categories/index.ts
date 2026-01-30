/** Categories Module - Public API */

// Types
export type { Domain, Category, CoursePreview } from "./types";

// Services
export { getAllDomains } from "./services/domainsAPI";

// Components
export { default as CategorySelectionPage } from "./components/CategorySelectionPage";
export { default as CategoryCard } from "./components/CategoryCard";

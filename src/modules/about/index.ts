// About Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type { LearningGridItem, StatItem } from "./types";

// Constants
export { LEARNING_GRID_ITEMS, STATS_DATA } from "./constants/about.constants";

// Components
export { default as ContactFormSection } from "./components/ContactFormSection";
export { default as LearningGrid } from "./components/LearningGrid";
export { default as Quote } from "./components/Quote";
export { default as Stats } from "./components/Stats";

// Container
export { default as AboutContainer } from "./containers/AboutContainer";

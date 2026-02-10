// About Module - Public API
// Scream Modular Architecture: Feature-based organization

// Interfaces
export * from "./interfaces/about.interfaces";

// Constants
export * from "./constants/about.constants";

// Components
export { default as AboutHero } from "./components/AboutHero";
export { default as AboutHistory } from "./components/AboutHistory";
export { default as AboutStats } from "./components/AboutStats";
export { default as AboutTestimonials } from "./components/AboutTestimonials";
export { default as AboutTeam } from "./components/AboutTeam";
export { default as StaffCard } from "./components/StaffCard";

// Hooks
export * from "./hooks/useTeamFilter";

// Animations
export * from "./animations";

// Container
export { default as AboutContainer } from "./containers/AboutContainer";

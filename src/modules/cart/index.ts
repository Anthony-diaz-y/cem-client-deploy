// Cart Module - Public API
// Scream Modular Architecture: Feature-based organization

// Constants
export { CART_TEXTS } from "./constants/cart.constants";

// Hooks
export { useCart } from "./hooks/useCart";
export type { UseCartReturn } from "./hooks/useCart";
export { useCartCourses } from "./hooks/useCartCourses";
export type { UseCartCoursesReturn } from "./hooks/useCartCourses";
export { useCartTotal } from "./hooks/useCartTotal";
export type { UseCartTotalReturn } from "./hooks/useCartTotal";

// Components
export { default as RenderCartCourses } from "./components/RenderCartCourses";
export { default as RenderTotalAmount } from "./components/RenderTotalAmount";
export { CourseThumbnail } from "./components/CourseThumbnail";

// Containers
export { default as CartContainer } from "./containers/CartContainer";

// Backward compatibility
export { default as Cart } from "./containers/CartContainer";

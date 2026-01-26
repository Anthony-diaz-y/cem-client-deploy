/**
 * Exportaciones centralizadas para componentes de categorías
 * Facilita las importaciones desde otros módulos
 */

export { default as CategoriesTable } from "./CategoriesTable";
export { default as CreateCategoryModal } from "./CreateCategoryModal";
export { default as EditCategoryModal } from "./EditCategoryModal";
export { default as DeleteCategoryModal } from "./DeleteCategoryModal";
export { default as DeleteAllCoursesModal } from "./DeleteAllCoursesModal";
export { default as DeleteCourseModal } from "./DeleteCourseModal";

export * from "./types";
export * from "../../hooks/category/useDeleteCategoryModal";
export * from "../../hooks/category/useCategoriesTable";


/**
 * API de Administración - Exportaciones centralizadas
 */

// Exportar todos los tipos
export * from "./admin/types";

// Exportar funciones del dashboard
export { getAdminDashboard } from "./admin/dashboard";

// Exportar funciones de instructores
export {
  getPendingInstructors,
  getAllInstructors,
  approveInstructor,
  rejectInstructor,
  getInstructorDetails,
  toggleInstructorStatus,
  updateInstructor,
  createInstructor,
} from "./admin/instructors";

// Exportar funciones de cursos
export {
  getPendingCourses,
  getAllCoursesAdmin,
  publishCourse,
  editCourseAdmin,
  deleteCourseAdmin,
  deleteMultipleCourses,
  getCourseDetailsAdmin,
} from "./admin/courses";

// Exportar funciones de categorías
export {
  createCategory,
  getAllCategories,
  getPublicCategories,
  updateCategory,
  getCategoryCourses,
  changeCourseCategory,
  changeMultipleCoursesCategory,
  deleteCategory,
} from "./admin/categories";

// Exportar funciones de reseñas
export {
  createReviewAdmin,
  updateReviewAdmin,
  deleteReviewAdmin,
} from "./admin/reviews";

// Exportar funciones de búsqueda global
export { globalSearch } from "./admin/search";
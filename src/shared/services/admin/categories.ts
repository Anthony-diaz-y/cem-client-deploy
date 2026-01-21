/**
 * Servicios de API para la gestión de Categorías (Admin)
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { categories } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  GetAllCategoriesResponse,
  GetPublicCategoriesResponse,
  DeleteCategoryResponse,
  GetCategoryCoursesRequest,
  GetCategoryCoursesResponse,
  ChangeCourseCategoryRequest,
  ChangeCourseCategoryResponse,
  ChangeMultipleCoursesCategoryRequest,
  ChangeMultipleCoursesCategoryResponse,
} from "./types";

/**
 * Crea una nueva categoría de curso
 * @param data - Datos de la categoría (nombre y descripción)
 * @param token - Token JWT de autenticación
 * @returns true si la operación fue exitosa
 */
export async function createCategory(
  data: CreateCategoryRequest,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Creando categoría...");
  try {
    const response = await apiConnector<CreateCategoryResponse>(
      "POST",
      categories.CREATE_CATEGORY_API,
      data as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Categoría creada exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al crear categoría");
    toast.dismiss(toastId);
    return false;
  }
}

/**
 * Obtiene todas las categorías del sistema
 * @param token - Token JWT de autenticación
 * @returns Lista de categorías
 */
export async function getAllCategories(
  token: string
): Promise<Category[]> {
  const toastId = toast.loading("Cargando categorías...");
  try {
    const response = await apiConnector<GetAllCategoriesResponse>(
      "GET",
      categories.SHOW_ALL_CATEGORIES_API,
      {},
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data || [];
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al obtener categorías");
    toast.dismiss(toastId);
    return [];
  }
}

/**
 * Obtiene todas las categorías públicas 
 */
export async function getPublicCategories(): Promise<Category[]> {
  try {
    const response = await apiConnector<GetPublicCategoriesResponse>(
      "GET",
      categories.CATEGORIES_API,
      {},
      {
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data || [];
  } catch (error) {
    const apiError = error as ApiError;
    console.error("Error al obtener categorías públicas:", apiError.response?.data?.message || apiError.message);
    return [];
  }
}

/**
 * Actualiza una categoría existente
 * @param categoryId - ID de la categoría a actualizar
 * @param name - Nuevo nombre de la categoría
 * @param description - Nueva descripción de la categoría
 * @param token - Token JWT de autenticación
 * @returns Categoría actualizada o null en caso de error
 */
export async function updateCategory(
  categoryId: string,
  name: string,
  description: string,
  token: string
): Promise<Category | null> {
  const toastId = toast.loading("Actualizando categoría...");
  try {
    const response = await apiConnector<UpdateCategoryResponse>(
      "PUT",
      categories.UPDATE_CATEGORY_API,
      { categoryId, name, description } as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Categoría actualizada exitosamente");
    toast.dismiss(toastId);
    return response.data.data?.category || null;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al actualizar categoría");
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Obtiene todos los cursos asociados a una categoría específica
 * @param categoryId - ID de la categoría
 * @param token - Token JWT de autenticación
 * @returns Datos de la categoría con sus cursos o null en caso de error
 */
export async function getCategoryCourses(
  categoryId: string,
  token: string
): Promise<GetCategoryCoursesResponse["data"] | null> {
  try {
    const response = await apiConnector<GetCategoryCoursesResponse>(
      "POST",
      categories.GET_CATEGORY_COURSES_API,
      { categoryId } as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al obtener cursos de la categoría");
    return null;
  }
}

/**
 * Cambia la categoría de un curso específico a otra categoría
 * @param courseId - ID del curso a cambiar
 * @param newCategoryId - ID de la nueva categoría
 * @param token - Token JWT de autenticación
 * @param silent - Si es true, no muestra toasts (útil para operaciones desde componentes)
 * @returns true si la operación fue exitosa
 */
export async function changeCourseCategory(
  courseId: string,
  newCategoryId: string,
  token: string,
  silent: boolean = false
): Promise<boolean> {
  const toastId = silent ? undefined : toast.loading("Cambiando categoría del curso...");
  try {
    const response = await apiConnector<ChangeCourseCategoryResponse>(
      "PUT",
      categories.CHANGE_COURSE_CATEGORY_API,
      { courseId, newCategoryId } as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    if (!silent) {
      toast.success(response.data.message || "Categoría del curso cambiada exitosamente");
      toast.dismiss(toastId);
    }
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    if (!silent) {
      toast.error(apiError.response?.data?.message || "Error al cambiar categoría del curso");
      toast.dismiss(toastId);
    }
    return false;
  }
}

/**
 * Cambia la categoría de múltiples cursos a la vez
 * Evita múltiples toasts al hacer cambios masivos
 * @param changes - Array de cambios { courseId, newCategoryId }
 * @param token - Token JWT de autenticación
 * @param silent - Si es true, no muestra toasts (útil cuando el componente los maneja)
 * @returns Resultado de la operación con información de éxitos y fallos, incluyendo flag success
 */
export async function changeMultipleCoursesCategory(
  changes: Array<{ courseId: string; newCategoryId: string }>,
  token: string,
  silent: boolean = false
): Promise<{ success: boolean; data: ChangeMultipleCoursesCategoryResponse["data"] | null; message?: string }> {
  if (changes.length === 0) {
    if (!silent) toast.error("No hay cambios para realizar");
    return { success: false, data: null, message: "No hay cambios para realizar" };
  }

  const toastId = silent ? undefined : toast.loading(`Cambiando categoría de ${changes.length} curso(s)...`);
  try {
    const response = await apiConnector<ChangeMultipleCoursesCategoryResponse>(
      "PUT",
      categories.CHANGE_MULTIPLE_COURSES_CATEGORY_API,
      { changes } as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error al cambiar las categorías");
    }

    const result = response.data.data;
    const allSuccessful = result.failedCount === 0;

    // Mostrar un solo toast de éxito o error según el resultado si no es silent
    if (!silent) {
      if (result.failedCount > 0) {
        toast.error(
          `${result.successfulCount} curso(s) reasignado(s) exitosamente. ${result.failedCount} curso(s) fallaron.`,
          { id: toastId }
        );
      } else {
        toast.success(response.data.message || `Todos los ${result.total} curso(s) fueron reasignados exitosamente`, { id: toastId });
      }
    } else if (toastId) {
      toast.dismiss(toastId);
    }

    return {
      success: allSuccessful,
      data: result,
      message: response.data.message || (allSuccessful ? "Todos los cursos fueron reasignados exitosamente" : "Algunos cursos no se pudieron reasignar")
    };
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || "Error al cambiar las categorías de los cursos";
    if (!silent) {
      toast.error(errorMessage, { id: toastId });
    } else if (toastId) {
      toast.dismiss(toastId);
    }
    return { success: false, data: null, message: errorMessage };
  }
}

/**
 * Intenta eliminar una categoría. Si tiene cursos asociados, retorna los cursos en la respuesta
 * Usa query parameter (no body) para evitar problemas de parsing en el backend
 * 
 * IMPORTANTE: Un 400 con cursos asociados NO es un error, es una respuesta válida del backend
 * que indica que se deben reasignar los cursos antes de eliminar la categoría.
 * 
 * @param categoryId - ID de la categoría a eliminar
 * @param token - Token JWT de autenticación
 * @returns Objeto con success, message, y opcionalmente courses si hay cursos asociados
 */
export async function deleteCategory(
  categoryId: string,
  token: string
): Promise<{
  success: boolean;
  message?: string;
  categories?: Category[];
  courses?: Array<{ numero: number; id: string; nombre: string; estado: string; instructor: string }>;
  category?: { id: string; name: string; totalCourses: number };
}> {
  const toastId = toast.loading("Eliminando categoría...");
  try {
    // Usar solo query parameter, sin body ni Content-Type
    const response = await apiConnector<DeleteCategoryResponse>(
      "DELETE",
      categories.DELETE_CATEGORY_API,
      undefined, // Sin body
      {
        Authorization: `Bearer ${token}`,
        // NO incluir Content-Type cuando no hay body
      },
      { categoryId } // Query parameters
    );

    // Si la respuesta es exitosa (status 200)
    if (response.status === 200 && response.data.success) {
      toast.success(response.data.message || "Categoría eliminada exitosamente");
      toast.dismiss(toastId);
      // El backend ahora devuelve la lista completa de categorías actualizada en response.data.data
      return {
        success: true,
        message: response.data.message,
        categories: response.data.data || undefined
      };
    }

    // Si tiene información de cursos (aunque no sea success), es una respuesta válida
    const responseData = response.data as DeleteCategoryResponse;
    if (responseData.courses && Array.isArray(responseData.courses) && responseData.courses.length > 0) {
      toast.dismiss(toastId);
      // NO mostrar error, es una respuesta válida que indica cursos asociados
      return {
        success: false,
        message: responseData.message,
        courses: responseData.courses,
        category: responseData.category
      };
    }

    // Otro tipo de error
    throw new Error(responseData.message || "Error al eliminar categoría");
  } catch (error) {
    const apiError = error as ApiError;
    toast.dismiss(toastId);

    // IMPORTANTE: Un 400 con cursos asociados NO es un error, es una respuesta válida del backend
    // El backend devuelve 400 cuando hay cursos asociados, pero incluye la información de los cursos
    if (apiError.response?.status === 400) {
      const errorData = apiError.response?.data as DeleteCategoryResponse;

      // Verificar si tiene cursos asociados (respuesta válida del backend)
      if (errorData?.courses && Array.isArray(errorData.courses) && errorData.courses.length > 0) {
        // NO mostrar toast de error, es información válida que indica que hay cursos asociados
        // Retornar la información para que el modal la maneje correctamente
        return {
          success: false,
          message: errorData.message || "Esta categoría tiene cursos asociados",
          courses: errorData.courses,
          category: errorData.category
        };
      }

      // Es un 400 pero sin cursos - error real
      const errorMessage = errorData?.message || "Error al eliminar categoría";
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }

    // Otro tipo de error (no es 400) - mostrar mensaje de error
    const errorData = apiError.response?.data as DeleteCategoryResponse;
    const errorMessage = errorData?.message || apiError.message || "Error al eliminar categoría";
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
}


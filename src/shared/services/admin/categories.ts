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
 */
export async function createCategory(
  data: CreateCategoryRequest,
  token: string,
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
      },
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
 */
export async function getAllCategories(token: string): Promise<Category[]> {
  const toastId = toast.loading("Cargando categorías...");
  try {
    const response = await apiConnector<GetAllCategoriesResponse>(
      "GET",
      categories.GET_ALL_CATEGORIES_API,
      {},
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data || [];
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message || "Error al obtener categorías",
    );
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
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data || [];
  } catch (error) {
    const apiError = error as ApiError;
    console.error(
      "Error al obtener categorías públicas:",
      apiError.response?.data?.message || apiError.message,
    );
    return [];
  }
}

/**
 * Actualiza una categoría existente
 */
export async function updateCategory(
  categoryId: string,
  name: string,
  description: string,
  token: string,
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
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(
      response.data.message || "Categoría actualizada exitosamente",
    );
    toast.dismiss(toastId);
    return response.data.data?.category || null;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message || "Error al actualizar categoría",
    );
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Obtiene todos los cursos asociados a una categoría específica
 */
export async function getCategoryCourses(
  categoryId: string,
  token: string,
): Promise<GetCategoryCoursesResponse["data"] | null> {
  try {
    const response = await apiConnector<GetCategoryCoursesResponse>(
      "POST",
      categories.GET_CATEGORY_COURSES_API,
      { categoryId } as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(
      apiError.response?.data?.message ||
        "Error al obtener cursos de la categoría",
    );
    return null;
  }
}

/**
 * Cambia la categoría de un curso específico a otra categoría
 */
export async function changeCourseCategory(
  courseId: string,
  newCategoryId: string,
  token: string,
  silent: boolean = false,
): Promise<boolean> {
  const toastId = silent
    ? undefined
    : toast.loading("Cambiando categoría del curso...");
  try {
    const response = await apiConnector<ChangeCourseCategoryResponse>(
      "PUT",
      categories.CHANGE_COURSE_CATEGORY_API,
      { courseId, newCategoryId } as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    if (!silent) {
      toast.success(
        response.data.message || "Categoría del curso cambiada exitosamente",
      );
      toast.dismiss(toastId);
    }
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    if (!silent) {
      toast.error(
        apiError.response?.data?.message ||
          "Error al cambiar categoría del curso",
      );
      toast.dismiss(toastId);
    }
    return false;
  }
}

/**
 * Cambia la categoría de múltiples cursos a la vez
 * Evita múltiples toasts al hacer cambios masivos
 */
export async function changeMultipleCoursesCategory(
  changes: Array<{ courseId: string; newCategoryId: string }>,
  token: string,
  silent: boolean = false,
): Promise<{
  success: boolean;
  data: ChangeMultipleCoursesCategoryResponse["data"] | null;
  message?: string;
}> {
  if (changes.length === 0) {
    if (!silent) toast.error("No hay cambios para realizar");
    return {
      success: false,
      data: null,
      message: "No hay cambios para realizar",
    };
  }

  const toastId = silent
    ? undefined
    : toast.loading(`Cambiando categoría de ${changes.length} curso(s)...`);
  try {
    const response = await apiConnector<ChangeMultipleCoursesCategoryResponse>(
      "PUT",
      categories.CHANGE_MULTIPLE_COURSES_CATEGORY_API,
      { changes } as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Error al cambiar las categorías",
      );
    }

    const result = response.data.data;
    const allSuccessful = result.failedCount === 0;

    if (!silent) {
      if (result.failedCount > 0) {
        toast.error(
          `${result.successfulCount} curso(s) reasignado(s) exitosamente. ${result.failedCount} curso(s) fallaron.`,
          { id: toastId },
        );
      } else {
        toast.success(
          response.data.message ||
            `Todos los ${result.total} curso(s) fueron reasignados exitosamente`,
          { id: toastId },
        );
      }
    } else if (toastId) {
      toast.dismiss(toastId);
    }

    return {
      success: allSuccessful,
      data: result,
      message:
        response.data.message ||
        (allSuccessful
          ? "Todos los cursos fueron reasignados exitosamente"
          : "Algunos cursos no se pudieron reasignar"),
    };
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage =
      apiError.response?.data?.message ||
      "Error al cambiar las categorías de los cursos";
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
 */
export async function deleteCategory(
  categoryId: string,
  token: string,
): Promise<{
  success: boolean;
  message?: string;
  categories?: Category[];
  courses?: Array<{
    numero: number;
    id: string;
    nombre: string;
    estado: string;
    instructor: string;
  }>;
  category?: { id: string; name: string; totalCourses: number };
}> {
  const toastId = toast.loading("Eliminando categoría...");
  try {
    const response = await apiConnector<DeleteCategoryResponse>(
      "DELETE",
      categories.DELETE_CATEGORY_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      },
      { categoryId },
    );

    if (response.status === 200 && response.data.success) {
      toast.success(
        response.data.message || "Categoría eliminada exitosamente",
      );
      toast.dismiss(toastId);
      return {
        success: true,
        message: response.data.message,
        categories: response.data.data || undefined,
      };
    }

    const responseData = response.data as DeleteCategoryResponse;
    if (
      responseData.courses &&
      Array.isArray(responseData.courses) &&
      responseData.courses.length > 0
    ) {
      toast.dismiss(toastId);
      return {
        success: false,
        message: responseData.message,
        courses: responseData.courses,
        category: responseData.category,
      };
    }

    // Otro tipo de error
    throw new Error(responseData.message || "Error al eliminar categoría");
  } catch (error) {
    const apiError = error as ApiError;
    toast.dismiss(toastId);

    if (apiError.response?.status === 400) {
      const errorData = apiError.response
        ?.data as unknown as DeleteCategoryResponse;

      if (
        errorData?.courses &&
        Array.isArray(errorData.courses) &&
        errorData.courses.length > 0
      ) {
        return {
          success: false,
          message: errorData.message || "Esta categoría tiene cursos asociados",
          courses: errorData.courses,
          category: errorData.category,
        };
      }

      const errorMessage = errorData?.message || "Error al eliminar categoría";
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }

    const errorData = apiError.response
      ?.data as unknown as DeleteCategoryResponse;
    const errorMessage =
      errorData?.message || apiError.message || "Error al eliminar categoría";
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Servicios de API para la gestión de Cursos (Admin)
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type {
  AdminCourse,
  PendingCoursesResponse,
  AllCoursesResponse,
  PublishCourseResponse,
  EditCourseResponse,
  DeleteCourseResponse,
  CourseDetailsResponse,
  CourseDetailsData,
} from "./types";

const {
  PENDING_COURSES_API,
  ALL_COURSES_API,
  PUBLISH_COURSE_API,
  EDIT_COURSE_ADMIN_API,
  DELETE_COURSE_ADMIN_API,
  GET_COURSE_DETAILS_ADMIN_API,
} = adminEndpoints;

/**
 * Obtiene la lista de cursos pendientes de publicación
 * @param token - Token JWT de autenticación
 * @returns Lista de cursos pendientes
 */
export async function getPendingCourses(token: string): Promise<AdminCourse[]> {
  const toastId = toast.loading("Cargando cursos pendientes...");
  try {
    const response = await apiConnector<PendingCoursesResponse>(
      "GET",
      PENDING_COURSES_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al cargar cursos pendientes");
    }
    toast.dismiss(toastId);
    return [];
  }
}

/**
 * Obtiene todos los cursos del sistema
 */
export async function getAllCoursesAdmin(
  token: string,
  filters?: { page?: number; limit?: number; search?: string; status?: string; categoryId?: string; instructorId?: string },
  silent = false
): Promise<AllCoursesResponse | null> {
  const toastId = silent ? null : toast.loading("Cargando cursos...");
  try {
    const params = new URLSearchParams();

    // Siempre enviar page y limit si existen
    if (filters?.page !== undefined) {
      params.append("page", filters.page.toString());
    }

    if (filters?.limit !== undefined) {
      params.append("limit", filters.limit.toString());
    }

    // Enviar search si existe y no está vacío
    if (filters?.search && filters.search.trim() !== "") {
      params.append("search", filters.search.trim());
    }

    // Enviar status si existe y no es "all"
    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }

    // Enviar categoryId si existe y no es "all"
    if (filters?.categoryId && filters.categoryId !== "all") {
      params.append("categoryId", filters.categoryId);
    }

    // Enviar instructorId si existe y no es "all"
    if (filters?.instructorId && filters.instructorId !== "all") {
      params.append("instructorId", filters.instructorId);
    }

    const url = params.toString()
      ? `${ALL_COURSES_API}?${params.toString()}`
      : ALL_COURSES_API;

    const response = await apiConnector<AllCoursesResponse>(
      "GET",
      url,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    if (toastId) toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error("❌ Error en getAllCoursesAdmin:", error);
    console.error("❌ Detalles del error:", apiError.response?.data);
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al cargar cursos");
    }
    if (toastId) toast.dismiss(toastId);
    return null;
  }
}

/**
 * Publica un curso pendiente
 */
export async function publishCourse(
  courseId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Publicando curso...");
  try {
    const response = await apiConnector<PublishCourseResponse>(
      "POST",
      PUBLISH_COURSE_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Curso publicado exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al publicar curso");
    }
    toast.dismiss(toastId);
    return false;
  }
}

/**
 * Edita un curso existente
 */
export async function editCourseAdmin(
  courseId: string,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<AdminCourse | null> {
  const toastId = toast.loading("Editando curso...");
  try {
    const requestData = data instanceof FormData
      ? (() => {
        const formData = new FormData();
        formData.append("courseId", courseId);
        for (const [key, value] of data.entries()) {
          formData.append(key, value);
        }
        return formData;
      })()
      : { ...data as Record<string, unknown>, courseId };

    const response = await apiConnector<EditCourseResponse>(
      "POST",
      EDIT_COURSE_ADMIN_API,
      requestData,
      {
        Authorization: `Bearer ${token}`,
        ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Curso editado exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al editar curso");
    }
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Elimina un curso del sistema
 */
export async function deleteCourseAdmin(
  courseId: string,
  token: string,
  silent: boolean = false
): Promise<boolean> {
  const toastId = silent ? undefined : toast.loading("Eliminando curso...");
  try {
    const response = await apiConnector<DeleteCourseResponse>(
      "DELETE",
      DELETE_COURSE_ADMIN_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    if (!silent) {
      toast.success(response.data.message || "Curso eliminado exitosamente");
      toast.dismiss(toastId);
    }
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    if (!silent) {
      // No mostrar toast si es error 401 (el interceptor ya lo maneja)
      if (apiError.response?.status !== 401) {
        toast.error(apiError.response?.data?.message || "Error al eliminar curso");
      }
      toast.dismiss(toastId);
    }
    return false;
  }
}

/**
 * Obtiene los detalles completos de un curso
 */
export async function getCourseDetailsAdmin(
  courseId: string,
  token: string
): Promise<CourseDetailsData | null> {
  try {
    const response = await apiConnector<CourseDetailsResponse>(
      "GET",
      `${GET_COURSE_DETAILS_ADMIN_API}/${courseId}`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al cargar detalles del curso");
    }
    return null;
  }
}

/**
 * Elimina múltiples cursos a la vez
 */
export async function deleteMultipleCourses(
  courseIds: string[],
  token: string
): Promise<{
  success: boolean;
  message: string;
  successful: string[];
  failed: Array<{ id: string; error: string }>;
}> {
  if (courseIds.length === 0) {
    return {
      success: false,
      message: "No hay cursos para eliminar",
      successful: [],
      failed: []
    };
  }

  const toastId = toast.loading(`Eliminando ${courseIds.length} curso(s)...`);
  const results = {
    success: true,
    message: "",
    successful: [] as string[],
    failed: [] as Array<{ id: string; error: string }>,
  };

  try {
    for (const courseId of courseIds) {
      try {
        const success = await deleteCourseAdmin(courseId, token, true);
        if (success) {
          results.successful.push(courseId);
        } else {
          results.success = false;
          results.failed.push({
            id: courseId,
            error: "No se pudo eliminar el curso",
          });
        }

        if (courseIds.indexOf(courseId) < courseIds.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error: any) {
        results.success = false;
        results.failed.push({
          id: courseId,
          error: error.message || "Error desconocido",
        });
      }
    }

    if (results.failed.length === 0) {
      results.message = `Todos los ${results.successful.length} curso(s) fueron eliminados exitosamente`;
      toast.success(results.message, { id: toastId });
    } else {
      results.message = `${results.successful.length} curso(s) eliminados, ${results.failed.length} fallaron`;
      if (results.successful.length > 0) {
        toast.success(results.message, { id: toastId });
      } else {
        toast.error("No se pudo eliminar ningún curso", { id: toastId });
      }
    }

    return results;
  } catch (error: any) {
    const errorMessage = error.message || "Error al eliminar los cursos";
    toast.error(errorMessage, { id: toastId });
    return {
      success: false,
      message: errorMessage,
      successful: results.successful,
      failed: results.failed,
    };
  }
}


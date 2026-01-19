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
    toast.error(apiError.response?.data?.message || "Error al cargar cursos pendientes");
    toast.dismiss(toastId);
    return [];
  }
}

/**
 * Obtiene todos los cursos del sistema
 * @param token - Token JWT de autenticación
 * @returns Lista de todos los cursos
 */
export async function getAllCoursesAdmin(token: string): Promise<AdminCourse[]> {
  try {
    const response = await apiConnector<AllCoursesResponse>(
      "GET",
      ALL_COURSES_API,
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
    toast.error(apiError.response?.data?.message || "Error al cargar cursos");
    return [];
  }
}

/**
 * Publica un curso pendiente
 * @param courseId - ID del curso a publicar
 * @param token - Token JWT de autenticación
 * @returns true si la operación fue exitosa
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
    toast.error(apiError.response?.data?.message || "Error al publicar curso");
    toast.dismiss(toastId);
    return false;
  }
}

/**
 * Edita un curso existente
 * @param courseId - ID del curso a editar
 * @param data - Datos del curso (FormData o objeto)
 * @param token - Token JWT de autenticación
 * @returns Curso editado o null en caso de error
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
    toast.error(apiError.response?.data?.message || "Error al editar curso");
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Elimina un curso del sistema
 * @param courseId - ID del curso a eliminar
 * @param token - Token JWT de autenticación
 * @param silent - Si es true, no muestra toasts (útil para operaciones masivas)
 * @returns true si la operación fue exitosa
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
      toast.error(apiError.response?.data?.message || "Error al eliminar curso");
      toast.dismiss(toastId);
    }
    return false;
  }
}

/**
 * Obtiene los detalles completos de un curso
 * @param courseId - ID del curso
 * @param token - Token JWT de autenticación
 * @returns Datos completos del curso o null en caso de error
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
    toast.error(apiError.response?.data?.message || "Error al cargar detalles del curso");
    return null;
  }
}

/**
 * Elimina múltiples cursos a la vez
 * Si el backend no tiene un endpoint para eliminar múltiples, elimina uno por uno
 * @param courseIds - Array de IDs de cursos a eliminar
 * @param token - Token JWT de autenticación
 * @returns Resultado de la operación con información de éxitos y fallos
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
    // Eliminar cursos uno por uno en modo silencioso (sin toasts individuales)
    // Con una pequeña espera entre eliminaciones para no sobrecargar el servidor
    for (const courseId of courseIds) {
      try {
        // Usar modo silencioso para no mostrar toasts individuales
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

        // Pequeña espera entre eliminaciones (100ms) para no sobrecargar
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

    // Mensaje final
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


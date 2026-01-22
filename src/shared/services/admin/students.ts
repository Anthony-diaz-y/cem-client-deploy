/**
 * Servicios de API para la gestión de Estudiantes (Admin)
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type {
  Student,
  StudentFilters,
  AllStudentsResponse,
  StudentDetailsResponse,
  UpdateStudentData,
  UpdateStudentResponse,
  ToggleStudentStatusResponse,
} from "./types";

export * from "./types";

const ALL_STUDENTS_API = "/admin/all-students";
const GET_STUDENT_DETAILS_API = "/admin/student";

/**
 * Obtiene todos los estudiantes con filtros opcionales
 */
export async function getAllStudents(
  token: string,
  filters?: StudentFilters,
  silent = false
): Promise<AllStudentsResponse | null> {
  const toastId = silent ? null : toast.loading("Cargando estudiantes...");
  try {
    const params = new URLSearchParams();

    if (filters?.active !== undefined) {
      params.append("active", filters.active ? "true" : "false");
    }

    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }

    if (filters?.page) {
      params.append("page", filters.page.toString());
    }

    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const url = params.toString()
      ? `${ALL_STUDENTS_API}?${params.toString()}`
      : ALL_STUDENTS_API;

    const response = await apiConnector<AllStudentsResponse>(
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
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al cargar estudiantes");
    }
    if (toastId) toast.dismiss(toastId);
    return null;
  }
}

/**
 * Obtiene los detalles completos de un estudiante
 */
export async function getStudentDetails(
  studentId: string,
  token: string
): Promise<StudentDetailsResponse["data"] | null> {
  const toastId = toast.loading("Cargando detalles del estudiante...");
  try {
    const response = await apiConnector<StudentDetailsResponse>(
      "GET",
      `${GET_STUDENT_DETAILS_API}/${studentId}`,
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
      toast.error(apiError.response?.data?.message || "Error al cargar detalles del estudiante");
    }
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Activa o desactiva un estudiante
 */
export async function toggleStudentStatus(
  studentId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Cambiando estado del estudiante...");
  try {
    const response = await apiConnector<ToggleStudentStatusResponse>(
      "PUT",
      `${GET_STUDENT_DETAILS_API}/${studentId}/toggle-status`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Estado del estudiante actualizado");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al cambiar estado del estudiante");
    }
    toast.dismiss(toastId);
    return false;
  }
}

/**
 * Actualiza los datos de un estudiante
 */
export async function updateStudent(
  studentId: string,
  updates: UpdateStudentData,
  token: string
): Promise<Student | null> {
  const toastId = toast.loading("Actualizando estudiante...");
  try {
    const response = await apiConnector<UpdateStudentResponse>(
      "PUT",
      `${GET_STUDENT_DETAILS_API}/${studentId}`,
      updates as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Estudiante actualizado exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al actualizar estudiante");
    }
    toast.dismiss(toastId);
    return null;
  }
}

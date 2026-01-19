/**
 * Servicios de API para la gestión de Instructores (Admin)
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type {
  Instructor,
  InstructorFilters,
  PendingInstructorsResponse,
  AllInstructorsResponse,
  InstructorDetailsResponse,
  UpdateInstructorData,
  UpdateInstructorResponse,
  ToggleInstructorStatusResponse,
  ApproveInstructorResponse,
} from "./types";

const {
  PENDING_INSTRUCTORS_API,
  ALL_INSTRUCTORS_API,
  APPROVE_INSTRUCTOR_API,
  REJECT_INSTRUCTOR_API,
  GET_INSTRUCTOR_DETAILS_API,
  TOGGLE_INSTRUCTOR_STATUS_API,
  UPDATE_INSTRUCTOR_API,
} = adminEndpoints;

/**
 * Obtiene la lista de instructores pendientes de aprobación
 * @param token - Token JWT de autenticación
 * @returns Lista de instructores pendientes
 */
export async function getPendingInstructors(token: string): Promise<Instructor[]> {
  try {
    const response = await apiConnector<PendingInstructorsResponse>(
      "GET",
      PENDING_INSTRUCTORS_API,
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
    toast.error(apiError.response?.data?.message || "Error al cargar instructores pendientes");
    return [];
  }
}

/**
 * Obtiene todos los instructores con filtros opcionales
 * @param token - Token JWT de autenticación
 * @param filters - Filtros opcionales (estado, activo, búsqueda)
 * @param silent - Si es true, no muestra toast de carga
 * @returns Respuesta con instructores filtrados o null en caso de error
 */
export async function getAllInstructors(
  token: string,
  filters?: InstructorFilters,
  silent = false
): Promise<AllInstructorsResponse | null> {
  const toastId = silent ? null : toast.loading("Cargando instructores...");
  try {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    
    if (filters?.active !== undefined) {
      params.append("active", filters.active ? "true" : "false");
    }
    
    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }

    const url = params.toString()
      ? `${ALL_INSTRUCTORS_API}?${params.toString()}`
      : ALL_INSTRUCTORS_API;

    const response = await apiConnector<AllInstructorsResponse>(
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
    toast.error(apiError.response?.data?.message || "Error al cargar instructores");
    if (toastId) toast.dismiss(toastId);
    return null;
  }
}

/**
 * Aprueba un instructor pendiente
 * @param instructorId - ID del instructor a aprobar
 * @param token - Token JWT de autenticación
 * @returns true si la operación fue exitosa
 */
export async function approveInstructor(
  instructorId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Aprobando instructor...");
  try {
    const response = await apiConnector<ApproveInstructorResponse>(
      "POST",
      APPROVE_INSTRUCTOR_API,
      { instructorId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Instructor aprobado exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al aprobar instructor");
    toast.dismiss(toastId);
    return false;
  }
}

/**
 * Rechaza un instructor pendiente
 * @param instructorId - ID del instructor a rechazar
 * @param token - Token JWT de autenticación
 * @returns true si la operación fue exitosa
 */
export async function rejectInstructor(
  instructorId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Rechazando instructor...");
  try {
    const response = await apiConnector<ApproveInstructorResponse>(
      "POST",
      REJECT_INSTRUCTOR_API,
      { instructorId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Instructor rechazado");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al rechazar instructor");
    toast.dismiss(toastId);
    return false;
  }
}

/**
 * Obtiene los detalles completos de un instructor
 * @param instructorId - ID del instructor
 * @param token - Token JWT de autenticación
 * @returns Datos del instructor con estadísticas y cursos o null en caso de error
 */
export async function getInstructorDetails(
  instructorId: string,
  token: string
): Promise<InstructorDetailsResponse["data"] | null> {
  const toastId = toast.loading("Cargando detalles del instructor...");
  try {
    const response = await apiConnector<InstructorDetailsResponse>(
      "GET",
      `${GET_INSTRUCTOR_DETAILS_API}/${instructorId}`,
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
    toast.error(apiError.response?.data?.message || "Error al cargar detalles del instructor");
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Activa o desactiva un instructor
 * @param instructorId - ID del instructor
 * @param active - Estado deseado (true = activo, false = inactivo)
 * @param token - Token JWT de autenticación
 * @returns true si la operación fue exitosa
 */
export async function toggleInstructorStatus(
  instructorId: string,
  active: boolean,
  token: string
): Promise<boolean> {
  const toastId = toast.loading(active ? "Activando instructor..." : "Desactivando instructor...");
  try {
    const response = await apiConnector<ToggleInstructorStatusResponse>(
      "PUT",
      `${TOGGLE_INSTRUCTOR_STATUS_API}/${instructorId}/toggle-status`,
      { active },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || (active ? "Instructor activado exitosamente" : "Instructor desactivado exitosamente"));
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al cambiar estado del instructor");
    toast.dismiss(toastId);
    return false;
  }
}

/**
 * Actualiza los datos de un instructor
 * @param instructorId - ID del instructor
 * @param updates - Datos a actualizar
 * @param token - Token JWT de autenticación
 * @returns Instructor actualizado o null en caso de error
 */
export async function updateInstructor(
  instructorId: string,
  updates: UpdateInstructorData,
  token: string
): Promise<Instructor | null> {
  const toastId = toast.loading("Actualizando instructor...");
  try {
    const body: UpdateInstructorData = {};
    
    if (updates.firstName !== undefined) {
      body.firstName = updates.firstName;
    }
    if (updates.lastName !== undefined) {
      body.lastName = updates.lastName;
    }
    if (updates.email !== undefined) {
      body.email = updates.email;
    }
    if (updates.approved !== undefined) {
      body.approved = updates.approved;
    }
    
    if (updates.contactNumber !== undefined) {
      if (typeof updates.contactNumber === 'string') {
        body.contactNumber = updates.contactNumber.trim() === '' 
          ? null 
          : (parseInt(updates.contactNumber.trim(), 10) || null);
      } else {
        body.contactNumber = updates.contactNumber;
      }
    }
    
    const response = await apiConnector<UpdateInstructorResponse>(
      "PUT",
      `${UPDATE_INSTRUCTOR_API}/${instructorId}`,
      body as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Instructor actualizado exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al actualizar instructor");
    toast.dismiss(toastId);
    return null;
  }
}


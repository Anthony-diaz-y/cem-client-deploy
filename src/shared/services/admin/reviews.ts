/**
 * Servicios de API para la gestión de Reseñas (Admin)
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewResponse,
  DeleteReviewResponse,
  CourseReview,
} from "./types";

const {
  CREATE_REVIEW_ADMIN_API,
  UPDATE_REVIEW_ADMIN_API,
  DELETE_REVIEW_ADMIN_API,
} = adminEndpoints;

/**
 * Crea una nueva reseña para un curso
 */
export async function createReviewAdmin(
  data: CreateReviewRequest,
  token: string
): Promise<CourseReview | null> {
  const toastId = toast.loading("Creando reseña...");
  try {
    const response = await apiConnector<ReviewResponse>(
      "POST",
      CREATE_REVIEW_ADMIN_API,
      data as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Reseña creada exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al crear reseña");
    }
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Actualiza una reseña existente
 */
export async function updateReviewAdmin(
  reviewId: string,
  data: UpdateReviewRequest,
  token: string
): Promise<CourseReview | null> {
  const toastId = toast.loading("Actualizando reseña...");
  try {
    const response = await apiConnector<ReviewResponse>(
      "PUT",
      `${UPDATE_REVIEW_ADMIN_API}/${reviewId}`,
      data as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Reseña actualizada exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al actualizar reseña");
    }
    toast.dismiss(toastId);
    return null;
  }
}

/**
 * Elimina una reseña del sistema
 */
export async function deleteReviewAdmin(
  reviewId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Eliminando reseña...");
  try {
    const response = await apiConnector<DeleteReviewResponse>(
      "DELETE",
      `${DELETE_REVIEW_ADMIN_API}/${reviewId}`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Reseña eliminada exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || "Error al eliminar reseña");
    }
    toast.dismiss(toastId);
    return false;
  }
}


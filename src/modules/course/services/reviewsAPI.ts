import { toast } from "react-hot-toast";
import { apiConnector } from "@shared/services/apiConnector";
import { ratingsEndpoints } from "@shared/services/apis";
import type { ApiError } from "../types";

// API Response Type
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Types for reviews
export interface CreateRatingData {
  courseId: string;
  rating: number; // 1-5
  review: string;
}

export interface UpdateRatingData {
  ratingId: string;
  rating: number; // 1-5
  review: string;
}

export interface Review {
  id: string;
  rating: number;
  review: string;
  courseId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
}

// ================ Create Rating ================
export const createRating = async (
  data: CreateRatingData | Record<string, unknown>,
  token: string
): Promise<Review | null> => {
  const toastId = toast.loading("Guardando reseña...");
  let result: Review | null = null;

  try {
    const response = await apiConnector<ApiResponse<Review>>("POST", ratingsEndpoints.CREATE_RATING_API, data as unknown as Record<string, unknown>, {
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE RATING API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "No se pudo crear la reseña");
    }

    result = response.data.data || null;
    toast.success("Reseña creada exitosamente");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE RATING API ERROR............", apiError);
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(
        apiError.response?.data?.message ||
          apiError.message ||
          "No se pudo crear la reseña"
      );
    }
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};

// ================ Update Rating ================
export const updateRating = async (
  data: UpdateRatingData | Record<string, unknown>,
  token: string
): Promise<Review | null> => {
  const toastId = toast.loading("Actualizando reseña...");
  let result: Review | null = null;

  try {
    const response = await apiConnector<ApiResponse<Review>>("PATCH", ratingsEndpoints.UPDATE_RATING_API, data as unknown as Record<string, unknown>, {
      Authorization: `Bearer ${token}`,
    });

    console.log("UPDATE RATING API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "No se pudo actualizar la reseña");
    }

    result = response.data.data || null;
    toast.success("Reseña actualizada exitosamente");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("UPDATE RATING API ERROR............", apiError);
    // No mostrar toast si es error 401 (el interceptor ya lo maneja)
    if (apiError.response?.status !== 401) {
      toast.error(
        apiError.response?.data?.message ||
          apiError.message ||
          "No se pudo actualizar la reseña"
      );
    }
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};

// ================ Get Reviews ================
export const getReviews = async (
  courseId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResponse | null> => {
  let result: ReviewsResponse | null = null;

  try {
    const response = await apiConnector<ApiResponse<ReviewsResponse>>(
      "GET",
      `${ratingsEndpoints.GET_REVIEWS_API}/${courseId}?page=${page}&limit=${limit}`
    );

    console.log("GET REVIEWS API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "No se pudieron obtener las reseñas");
    }

    result = response.data.data || null;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("GET REVIEWS API ERROR............", apiError);
    // No mostrar toast para errores de obtención de reseñas (puede ser que no haya reseñas)
  }

  return result;
};

// ================ Get User Review ================
export const getUserReview = async (
  courseId: string,
  token: string
): Promise<Review | null> => {
  let result: Review | null = null;

  try {
    const response = await apiConnector<ApiResponse<Review>>(
      "GET",
      `${ratingsEndpoints.GET_USER_REVIEW_API}/${courseId}`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("GET USER REVIEW API RESPONSE............", response);

    if (response?.data?.success && response.data.data) {
      result = response.data.data;
    }
  } catch (error) {
    const apiError = error as ApiError;
    console.log("GET USER REVIEW API ERROR............", apiError);
    // No mostrar toast si el usuario no tiene reseña (es normal)
  }

  return result;
};

// ================ Get Rating Stats ================
export const getRatingStats = async (courseId: string): Promise<RatingStats | null> => {
  let result: RatingStats | null = null;

  try {
    const response = await apiConnector<ApiResponse<RatingStats>>(
      "GET",
      `${ratingsEndpoints.GET_RATING_STATS_API}/${courseId}`
    );

    console.log("GET RATING STATS API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "No se pudieron obtener las estadísticas");
    }

    result = response.data.data || null;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("GET RATING STATS API ERROR............", apiError);
    // No mostrar toast para errores de estadísticas
  }

  return result;
};


import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"
import type { ApiError } from "@modules/auth/types"
import { ApiResponse } from "./types"

const {
  CREATE_SECTION_API,
  UPDATE_SECTION_API,
  DELETE_SECTION_API,
} = courseEndpoints

// Crear sección
export const createSection = async (data: Record<string, unknown>, token: string, suppressToast: boolean = false) => {
  let result = null
  const toastId = !suppressToast ? toast.loading("Loading...") : null

  try {
    const response = await apiConnector<{ success: boolean; updatedCourseDetails?: unknown; message?: string }>("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }

    result = response?.data?.updatedCourseDetails

    if (!result) {
      throw new Error("No se recibieron los detalles del curso actualizado");
    }

    if (!suppressToast) {
      toast.success(response?.data?.message || "Section created")
    }
  } catch (error) {
    const apiError = error as ApiError;
    if (!suppressToast) {
      toast.error(apiError.message || "Could Not Create Section")
    } else {
      throw error;
    }
  }
  if (toastId) {
    toast.dismiss(toastId)
  }
  return result
}

// Actualizar sección
export const updateSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector<ApiResponse>("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }

    result = response?.data?.data
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.message || "Could Not Update Section")
  }
  toast.dismiss(toastId)
  return result
}

// Eliminar sección
export const deleteSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector<ApiResponse>("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }

    result = response?.data?.data
    toast.success("Course Section Deleted")
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.message || "Could Not Delete Section")
  }
  toast.dismiss(toastId)
  return result
}


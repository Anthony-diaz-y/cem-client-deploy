import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"
import type { ApiError } from "@modules/auth/types"
import { ApiResponse } from "./types"

const {
  REORDER_SECTIONS_API,
  REORDER_SUBSECTIONS_API,
  MOVE_SUBSECTION_API,
} = courseEndpoints

// Reordenar secciones
export const reorderSections = async (data: Record<string, unknown>, token: string, showToast: boolean = false) => {
  let result = null

  try {
    const response = await apiConnector<ApiResponse>("POST", REORDER_SECTIONS_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Reorder Sections")
    }

    result = response?.data?.data
    if (showToast) {
      toast.success("Secciones reordenadas exitosamente")
    }
  } catch (error) {
    const apiError = error as ApiError;
    if (showToast) {
      toast.error(apiError.response?.data?.message || apiError.message || "Error al reordenar secciones")
    }
    throw error;
  }

  return result
}

// Reordenar subsecciones
export const reorderSubSections = async (data: Record<string, unknown>, token: string, showToast: boolean = false) => {
  let result = null

  try {
    const response = await apiConnector<ApiResponse>("POST", REORDER_SUBSECTIONS_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Reorder SubSections")
    }

    result = response?.data?.data
    if (showToast) {
      toast.success("Lecciones reordenadas exitosamente")
    }
  } catch (error) {
    const apiError = error as ApiError;
    if (showToast) {
      toast.error(apiError.response?.data?.message || apiError.message || "Error al reordenar lecciones")
    }
    throw error;
  }

  return result
}

// Mover subsección
export const moveSubSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Moviendo lección...")

  try {
    const response = await apiConnector<ApiResponse>("POST", MOVE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Move SubSection")
    }

    result = response?.data?.data
    toast.success("Lección movida exitosamente")
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || apiError.message || "Error al mover lección")
  }

  toast.dismiss(toastId)
  return result
}


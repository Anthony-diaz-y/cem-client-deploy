import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"
import type { ApiError } from "@modules/auth/types"
import { ApiResponse } from "./types"

const {
  LECTURE_COMPLETION_API,
} = courseEndpoints

interface LectureCompletionResponse extends ApiResponse {
  isCompleted?: boolean;
  error?: string;
}

// Marcar lección como completada
export const markLectureAsComplete = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector<LectureCompletionResponse>("POST", LECTURE_COMPLETION_API, data as Record<string, unknown>, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.message || "Could Not Mark Lecture As Complete")
    result = false
  }
  toast.dismiss(toastId)
  return result
}

// Alternar estado de completado de lección
export const toggleLectureCompletion = async (
  data: Record<string, unknown>,
  token: string
): Promise<{ success: boolean; isCompleted: boolean } | null> => {
  const toastId = toast.loading("Actualizando progreso...")
  try {
    const response = await apiConnector<LectureCompletionResponse>("POST", LECTURE_COMPLETION_API, data as Record<string, unknown>, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success && !response.data.message) {
      throw new Error(response.data.error || "Error al actualizar el progreso")
    }

    const isCompleted = response.data.isCompleted ?? (response.data.data as { isCompleted?: boolean })?.isCompleted ?? true

    toast.success(response.data.message || (isCompleted ? "Lecture marcada como completada" : "Lecture desmarcada"))

    toast.dismiss(toastId)
    return { success: true, isCompleted }
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || apiError.message || "No se pudo actualizar el estado de la lecture"
    toast.error(errorMessage)
    toast.dismiss(toastId)
    return { success: false, isCompleted: false }
  }
}


import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"
import type { ApiError } from "@modules/auth/types"
import { ApiResponse } from "./types"

const {
  CREATE_RATING_API,
} = courseEndpoints

// Crear calificación
export const createRating = async (data: Record<string, unknown>, token: string) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector<ApiResponse>("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    const apiError = error as ApiError;
    toast.error(apiError.message || "Could Not Create Rating")
  }
  toast.dismiss(toastId)
  return success
}


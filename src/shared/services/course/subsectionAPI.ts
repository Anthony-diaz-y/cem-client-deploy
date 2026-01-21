import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"
import type { ApiError } from "@modules/auth/types"
import { ApiResponse } from "./types"

const {
  CREATE_SUBSECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SUBSECTION_API,
} = courseEndpoints

// Crear subsección (lección)
export const createSubSection = async (data: FormData | Record<string, unknown>, token: string, suppressToast: boolean = false) => {
  let result = null
  const toastId = !suppressToast ? toast.loading("Loading...") : null

  try {
    const response = await apiConnector<ApiResponse>("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Add Lecture")
    }

    result = response?.data?.data
    if (!suppressToast) {
      toast.success("Lecture Added")
    }
  } catch (error) {
    const apiError = error as ApiError;

    if (!suppressToast) {
      if (apiError.response?.status === 400) {
        toast.error(apiError.response?.data?.message || "Datos inválidos. Verifica que todos los campos estén completos.")
      } else if (apiError.response?.status === 401) {
        toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.")
      } else if (apiError.response?.status === 403) {
        toast.error("No tienes permisos para agregar lecciones. Debes ser instructor.")
      } else {
        toast.error(apiError.response?.data?.message || apiError.message || "Could Not Add Lecture")
      }
    } else {
      throw error;
    }
  }
  if (toastId) {
    toast.dismiss(toastId)
  }
  return result
}

// Actualizar subsección (lección)
export const updateSubSection = async (data: FormData | Record<string, unknown>, token: string, suppressToast: boolean = false) => {
  let result = null
  const toastId = !suppressToast ? toast.loading("Loading...") : null

  try {
    const response = await apiConnector<ApiResponse>("PUT", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Update Lecture")
    }

    result = response?.data?.data
    if (!suppressToast) {
      toast.success("Lecture Updated")
    }
  } catch (error) {
    const apiError = error as ApiError;

    if (!suppressToast) {
      if (apiError.response?.status === 400) {
        toast.error(apiError.response?.data?.message || "Invalid data. Please check all fields.")
      } else if (apiError.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else if (apiError.response?.status === 403) {
        toast.error("You don't have permission to update lectures. You must be an instructor.")
      } else if (apiError.response?.status === 500) {
        toast.error(apiError.response?.data?.message || "Server error. Please try again later.")
      } else {
        toast.error(apiError.response?.data?.message || apiError.message || "Could Not Update Lecture")
      }
    } else {
      throw error;
    }
  }
  if (toastId) {
    toast.dismiss(toastId)
  }
  return result
}

// Eliminar subsección (lección)
export const deleteSubSection = async (data: { subSectionId: string; sectionId: string }, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector<ApiResponse>("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    result = response?.data?.data
    toast.success("Lecture Deleted")
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.message || "Could Not Delete Lecture")
  }
  toast.dismiss(toastId)
  return result
}

// Obtener detalles de subsección
export const fetchSubSectionDetails = async (subSectionId: string) => {
  let result = null;
  try {
    const response = await apiConnector<ApiResponse>("GET", `${DELETE_SUBSECTION_API}${subSectionId}`)

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch SubSection Details")
    }
    result = response.data.data;
  } catch {
    // Error silencioso
  }
  return result
}


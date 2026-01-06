import { toast } from "react-hot-toast"

import { setLoading, setUser } from "@modules/auth/store/profileSlice"
import { apiConnector } from "./apiConnector"
import { profileEndpoints } from "./apis"
import { logout } from "@modules/auth/services/authAPI"
import type { AppDispatch } from "@shared/store/store"
import type { NavigateFunction } from "@modules/auth/types"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints

// API Response Types
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  accountType?: string;
  [key: string]: unknown;
}


// ================ get User Details  ================
export function getUserDetails(token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector<ApiResponse<UserData>>("GET", GET_USER_DETAILS_API, undefined, { Authorization: `Bearer ${token}`, })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Could not get user details")
      }
      const userData = response.data.data;
      const userImage = userData.image
        ? userData.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`
      dispatch(setUser({ ...userData, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

// ================ get User Enrolled Courses  ================
export async function getUserEnrolledCourses(token: string) {
  // const toastId = toast.loading("Loading...")
  let result: unknown[] = []
  try {
    const response = await apiConnector<ApiResponse<unknown[]>>("GET", GET_USER_ENROLLED_COURSES_API, { token } as Record<string, unknown>, { Authorization: `Bearer ${token}`, })

    console.log("GET_USER_ENROLLED_COURSES_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message || "Could not get enrolled courses")
    }
    result = response.data.data || []
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  // toast.dismiss(toastId)
  return result
}

// ================ get Instructor Data  ================
export async function getInstructorData(token: string) {
  // const toastId = toast.loading("Loading...")
  let result: unknown[] = []
  try {
    interface InstructorDataResponse {
      courses?: unknown[];
      [key: string]: unknown;
    }
    const response = await apiConnector<InstructorDataResponse>("GET", GET_INSTRUCTOR_DATA_API, undefined, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    if (response?.data?.courses) {
      result = response.data.courses
    }
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  // toast.dismiss(toastId)
  return result
}

import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"
import type { ApiError } from "@modules/auth/types"
import { ApiResponse, InstructorCourse } from "./types"
import { removeDuplicateCourses } from "./utils"

const {
  GET_ALL_INSTRUCTOR_COURSES_API,
} = courseEndpoints

// Obtener cursos del instructor
export const fetchInstructorCourses = async (token: string): Promise<InstructorCourse[]> => {
  let result: InstructorCourse[] = []
  try {
    const response = await apiConnector<ApiResponse<InstructorCourse[]>>(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }

    const coursesData = response?.data?.data || [];
    result = removeDuplicateCourses(coursesData);
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.response?.status !== 401) {
      toast.error(apiError.response?.data?.message || apiError.message || "No se pudieron obtener los cursos del instructor")
    }
  }
  return result
}


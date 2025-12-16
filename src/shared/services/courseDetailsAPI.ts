import { toast } from "react-hot-toast"
// import { setLoading } from "../../modules/auth/store/profileSlice";
import { apiConnector } from "./apiConnector"
import { courseEndpoints } from "./apis"
import type { ApiError } from "@modules/auth/types"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints



// ================ get All Courses ================
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    const apiError = error as ApiError;
    console.log("GET_ALL_COURSE_API API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Fetch Courses")
  }
  toast.dismiss(toastId)
  return result
}


// ================ fetch Course Details ================
export const fetchCourseDetails = async (courseId: string) => {
  // const toastId = toast.loading('Loading')
  //   dispatch(setLoading(true));
  let result = null;

  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, { courseId, })
    console.log("COURSE_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    const apiError = error as ApiError;
    console.log("COURSE_DETAILS_API API ERROR............", apiError)
    result = apiError.response?.data || null
    // toast.error(apiError.response?.data?.message);
  }
  // toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}

// ================ fetch Course Categories ================
export const fetchCourseCategories = async () => {
  let result = []

  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    console.log("COURSE_CATEGORIES_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    const apiError = error as ApiError;
    console.log("COURSE_CATEGORY_API API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Fetch Course Categories")
  }
  return result
}


// ================ add Course Details ================
export const addCourseDetails = async (data: Record<string, unknown>, token: string) => {
  const toastId = toast.loading("Loading...")
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token} `,
    })
    console.log("CREATE COURSE API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }

    result = response?.data?.data
    toast.success("Course Details Added Successfully")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE COURSE API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Add Course Details")
  }
  toast.dismiss(toastId)
  return result
}


// ================ edit Course Details ================
export const editCourseDetails = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token} `,
    })
    console.log("EDIT COURSE API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }

    result = response?.data?.data
    toast.success("Course Details Updated Successfully")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("EDIT COURSE API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Update Course Details")
  }
  toast.dismiss(toastId)
  return result
}


// ================ create Section ================
export const createSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("CREATE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }

    result = response?.data?.updatedCourseDetails
    toast.success("Course Section Created")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE SECTION API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Create Section")
  }
  toast.dismiss(toastId)
  return result
}


// ================ create SubSection ================
export const createSubSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Added")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE SUB-SECTION API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Add Lecture")
  }
  toast.dismiss(toastId)
  return result
}


// ================ Update Section ================
export const updateSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("UPDATE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }

    result = response?.data?.data
    toast.success("Course Section Updated")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("UPDATE SECTION API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Update Section")
  }
  toast.dismiss(toastId)
  return result
}


// ================ Update SubSection ================
export const updateSubSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Updated")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("UPDATE SUB-SECTION API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Update Lecture")
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete Section ================
export const deleteSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("DELETE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }

    result = response?.data?.data
    toast.success("Course Section Deleted")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE SECTION API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Delete Section")
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete SubSection ================
export const deleteSubSection = async (data: Record<string, unknown>, token: string) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    result = response?.data?.data
    toast.success("Lecture Deleted")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE SUB-SECTION API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Delete Lecture")
  }
  toast.dismiss(toastId)
  return result
}

// ================ fetch Instructor Courses ================
export const fetchInstructorCourses = async (token: string) => {
  let result = []
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      undefined,
      {
        Authorization: `Bearer ${token} `,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    const apiError = error as ApiError;
    console.log("INSTRUCTOR COURSES API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Fetch Instructor Courses")
  }
  return result
}


// ================ delete Course ================
export const deleteCourse = async (data: Record<string, unknown>, token: string) => {
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE COURSE API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Delete Course")
  }
  // toast.dismiss(toastId)
}


// ================ get Full Details Of Course ================
export const getFullDetailsOfCourse = async (courseId: string, token: string) => {
  // const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token} `,
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    const apiError = error as ApiError;
    console.log("COURSE_FULL_DETAILS_API API ERROR............", apiError)
    result = apiError.response?.data || null
    // toast.error(apiError.response?.data?.message);
  }
  // toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}


// ================ mark Lecture As Complete ================
export const markLectureAsComplete = async (data: Record<string, unknown>, token: string) => {
  let result = null
  // console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("MARK_LECTURE_AS_COMPLETE_API API RESPONSE............", response)

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    const apiError = error as ApiError;
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Mark Lecture As Complete")
    result = false
  }
  toast.dismiss(toastId)
  return result
}


// ================ create Course Rating  ================
export const createRating = async (data: Record<string, unknown>, token: string) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("CREATE RATING API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    const apiError = error as ApiError;
    console.log("CREATE RATING API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Create Rating")
  }
  toast.dismiss(toastId)
  return success
}
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


// Función para validar UUID
const isValidUUID = (id: string): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// ================ fetch Course Details ================
export const fetchCourseDetails = async (courseId: string) => {
  // const toastId = toast.loading('Loading')
  //   dispatch(setLoading(true));
  let result = null;

  try {
    // Validar que courseId existe y es un UUID válido antes de hacer la petición
    if (!courseId || typeof courseId !== 'string') {
      console.error("Course ID is required and must be a string");
      return null;
    }

    // Validar formato UUID
    if (!isValidUUID(courseId)) {
      console.error(
        "Invalid course ID format (expected UUID):",
        courseId,
        "\nThe course ID must be a valid UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
      );
      return null;
    }

    const response = await apiConnector("POST", COURSE_DETAILS_API, { courseId, })
    console.log("COURSE_DETAILS_API API RESPONSE............", response)

    // Verificar estructura de respuesta antes de desestructurar
    if (!response?.data) {
      console.error("Invalid response structure: response.data is undefined");
      return null;
    }

    if (!response.data.success) {
      const errorMessage = response.data.message || "Could not fetch course details";
      console.error("API returned success: false", errorMessage);
      throw new Error(errorMessage);
    }

    // Verificar que la estructura esperada existe
    if (response.data.data && response.data.data.courseDetails) {
      result = response.data;
    } else {
      console.error("Invalid data structure: courseDetails not found in response");
      return null;
    }
  } catch (error) {
    const apiError = error as ApiError;
    console.error("COURSE_DETAILS_API API ERROR............", apiError);
    
    // Manejo específico de errores 500
    if (apiError.response?.status === 500) {
      console.error('Error del servidor (500):', apiError.response.data);
      // No retornar datos en caso de error 500
      return null;
    }
    
    result = apiError.response?.data || null;
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
    
    // Invalidar cache del instructor después de crear curso (según recomendación del backend)
    if (typeof window !== "undefined") {
      // Importar dinámicamente para evitar dependencias circulares
      const { invalidateInstructorCache } = await import("@modules/instructor/hooks/useInstructorData");
      invalidateInstructorCache();
      
      // Disparar evento para refrescar datos
      window.dispatchEvent(new CustomEvent("instructorDataRefresh"));
    }
    
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
    // No establecer Content-Type manualmente cuando se envía FormData
    // El navegador lo establecerá automáticamente con el boundary correcto
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Add Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Added")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE SUB-SECTION API ERROR............", apiError)
    
    // Manejar errores específicos del backend
    if (apiError.response?.status === 400) {
      toast.error(apiError.response?.data?.message || "Datos inválidos. Verifica que todos los campos estén completos.")
    } else if (apiError.response?.status === 401) {
      toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.")
    } else if (apiError.response?.status === 403) {
      toast.error("No tienes permisos para agregar lecciones. Debes ser instructor.")
    } else {
      toast.error(apiError.response?.data?.message || apiError.message || "Could Not Add Lecture")
    }
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
    // No establecer Content-Type manualmente cuando se envía FormData
    // El navegador lo establecerá automáticamente con el boundary correcto
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Update Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Updated")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("UPDATE SUB-SECTION API ERROR............", apiError)
    
    // Manejo específico de errores
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
    
    const coursesData = response?.data?.data || [];
    
    // Eliminar duplicados basándose en el ID (priorizar 'id' sobre '_id')
    const uniqueCourses = coursesData.reduce((acc: any[], course: any) => {
      const courseId = course?.id || course?._id;
      if (!courseId) return acc;
      
      // Verificar si ya existe un curso con este ID
      const existingIndex = acc.findIndex((c: any) => {
        const cId = c?.id || c?._id;
        return cId === courseId;
      });
      
      if (existingIndex === -1) {
        acc.push(course);
      }
      return acc;
    }, []);
    
    result = uniqueCourses;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("INSTRUCTOR COURSES API ERROR............", apiError)
    toast.error(apiError.message || "Could Not Fetch Instructor Courses")
  }
  return result
}


// ================ delete Course ================
export const deleteCourse = async (data: Record<string, unknown>, token: string) => {
  const toastId = toast.loading("Deleting course...")
  try {
    // Validar que courseId existe y es válido
    const courseId = data.courseId;
    if (!courseId || typeof courseId !== 'string') {
      throw new Error("Course ID is required");
    }
    
    // Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(courseId)) {
      throw new Error("Invalid course ID format");
    }
    
    // Para DELETE, enviar courseId como query param
    const response = await apiConnector(
      "DELETE", 
      DELETE_COURSE_API, 
      data, // También en el body por si el backend lo requiere
      {
        Authorization: `Bearer ${token} `,
      },
      { courseId: courseId as string } // Query params
    )
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE COURSE API ERROR............", apiError)
    
    // Manejo específico de errores
    if (apiError.response?.status === 400) {
      toast.error(apiError.response?.data?.message || "Invalid course ID")
    } else if (apiError.response?.status === 401) {
      toast.error("Session expired. Please login again.")
    } else if (apiError.response?.status === 403) {
      toast.error("You don't have permission to delete this course")
    } else if (apiError.response?.status === 404) {
      toast.error("Course not found")
    } else if (apiError.response?.status === 500) {
      toast.error(apiError.response?.data?.message || "Server error. Please try again later.")
    } else {
      toast.error(apiError.response?.data?.message || apiError.message || "Could Not Delete Course")
    }
  }
  toast.dismiss(toastId)
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

// ================ toggle Lecture Completion ================
// El backend ahora funciona como toggle automático: si está completada la desmarca, si no está la marca
export const toggleLectureCompletion = async (
  data: Record<string, unknown>, 
  token: string
): Promise<{ success: boolean; isCompleted: boolean } | null> => {
  const toastId = toast.loading("Actualizando progreso...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token} `,
    })
    console.log("TOGGLE_LECTURE_COMPLETION_API API RESPONSE............", response)

    if (!response.data.success && !response.data.message) {
      throw new Error(response.data.error || "Error al actualizar el progreso")
    }

    // El backend retorna isCompleted en la respuesta
    const isCompleted = response.data.isCompleted ?? response.data.data?.isCompleted ?? true
    
    toast.success(response.data.message || (isCompleted ? "Lecture marcada como completada" : "Lecture desmarcada"))
    
    toast.dismiss(toastId)
    return { success: true, isCompleted }
  } catch (error) {
    const apiError = error as ApiError;
    console.log("TOGGLE_LECTURE_COMPLETION_API API ERROR............", apiError)
    const errorMessage = apiError.response?.data?.message || apiError.message || "No se pudo actualizar el estado de la lecture"
    toast.error(errorMessage)
    toast.dismiss(toastId)
    return { success: false, isCompleted: false }
  }
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
import { toast } from "react-hot-toast";

// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "@shared/services/apiConnector";
import { courseEndpoints } from "@shared/services/apis";
import {
  ApiError,
  CourseFormData,
  SectionData,
  SubSectionData,
  DeleteSectionData,
  DeleteSubSectionData,
  DeleteCourseData,
  LectureCompletionData,
  RatingData,
} from "../types";

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
} = courseEndpoints;

// ================ get All Courses ================
export const getAllCourses = async () => {
  const toastId = toast.loading("Cargando...");
  let result = [];

  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("GET_ALL_COURSE_API API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudieron obtener los cursos"
    );
  }
  toast.dismiss(toastId);
  return result;
};

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

    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    console.log("COURSE_DETAILS_API API RESPONSE............", response);

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
  return result;
};

// ================ fetch Course Categories ================
export const fetchCourseCategories = async () => {
  let result = [];

  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    console.log("COURSE_CATEGORIES_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("COURSE_CATEGORY_API API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudieron obtener las categorías de cursos"
    );
  }
  return result;
};

// ================ add Course Details ================
export const addCourseDetails = async (data: CourseFormData, token: string) => {
  const toastId = toast.loading("Cargando...");
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE COURSE API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }

    result = response?.data?.data;
    toast.success("Detalles del curso agregados exitosamente");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE COURSE API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudieron agregar los detalles del curso"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ edit Course Details ================
export const editCourseDetails = async (
  data: CourseFormData,
  token: string
) => {
  let result = null;
  const toastId = toast.loading("Cargando...");

  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("EDIT COURSE API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }

    result = response?.data?.data;
    toast.success("Detalles del curso actualizados exitosamente");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("EDIT COURSE API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudieron actualizar los detalles del curso"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ create Section ================
export const createSection = async (data: SectionData, token: string) => {
  let result = null;
  const toastId = toast.loading("Cargando...");

  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE SECTION API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }

    result = response?.data?.updatedCourseDetails;
    toast.success("Sección del curso creada");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE SECTION API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo crear la sección"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ create SubSection ================
export const createSubSection = async (
  data: SubSectionData | CourseFormData,
  token: string
) => {
  let result = null;
  const toastId = toast.loading("Cargando...");

  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE SUB-SECTION API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }

    result = response?.data?.data;
    toast.success("Lección agregada");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE SUB-SECTION API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo agregar la lección"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ Update Section ================
export const updateSection = async (data: SectionData, token: string) => {
  let result = null;
  const toastId = toast.loading("Cargando...");

  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE SECTION API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }

    result = response?.data?.data;
    toast.success("Sección del curso actualizada");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("UPDATE SECTION API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo actualizar la sección"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ Update SubSection ================
export const updateSubSection = async (
  data: SubSectionData | CourseFormData,
  token: string
) => {
  let result = null;
  const toastId = toast.loading("Cargando...");

  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE SUB-SECTION API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }

    result = response?.data?.data;
    toast.success("Lección actualizada");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("UPDATE SUB-SECTION API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo actualizar la lección"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ delete Section ================
export const deleteSection = async (data: DeleteSectionData, token: string) => {
  let result = null;
  const toastId = toast.loading("Cargando...");

  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SECTION API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }

    result = response?.data?.data;
    toast.success("Sección del curso eliminada");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE SECTION API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo eliminar la sección"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ delete SubSection ================
export const deleteSubSection = async (
  data: DeleteSubSectionData,
  token: string
) => {
  let result = null;
  const toastId = toast.loading("Cargando...");
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SUB-SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture");
    }
    result = response?.data?.data;
    toast.success("Lección eliminada");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE SUB-SECTION API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo eliminar la lección"
    );
  }
  toast.dismiss(toastId);
  return result;
};

// ================ fetch Instructor Courses ================
export const fetchInstructorCourses = async (token: string) => {
  let result = [];
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("INSTRUCTOR COURSES API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("INSTRUCTOR COURSES API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudieron obtener los cursos del instructor"
    );
  }
  return result;
};

// ================ delete Course ================
export const deleteCourse = async (data: DeleteCourseData, token: string) => {
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Curso eliminado");
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE COURSE API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo eliminar el curso"
    );
  }
  // toast.dismiss(toastId)
};

// ================ get Full Details Of Course ================
export const getFullDetailsOfCourse = async (
  courseId: string,
  token: string
) => {
  // const toastId = toast.loading("Loading...")
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

    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response);

    // Verificar estructura de respuesta antes de desestructurar
    if (!response?.data) {
      console.error("Invalid response structure: response.data is undefined");
      return null;
    }

    if (!response.data.success) {
      const errorMessage = response.data.message || "Could not fetch full course details";
      console.error("API returned success: false", errorMessage);
      throw new Error(errorMessage);
    }

    // Verificar que la estructura esperada existe
    if (response.data.data && response.data.data.courseDetails) {
      result = response.data.data;
    } else {
      console.error("Invalid data structure: courseDetails not found in response.data.data");
      return null;
    }
  } catch (error) {
    const apiError = error as ApiError;
    console.error("COURSE_FULL_DETAILS_API API ERROR............", apiError);
    
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
  return result;
};

// ================ mark Lecture As Complete ================
export const markLectureAsComplete = async (
  data: LectureCompletionData,
  token: string
) => {
  let result = null;
  // console.log("mark complete data", data)
  const toastId = toast.loading("Cargando...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    );

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lección completada");
    result = true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo marcar la lección como completada"
    );
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

// ================ create Course Rating  ================
export const createRating = async (data: RatingData, token: string) => {
  const toastId = toast.loading("Cargando...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE RATING API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    toast.success("Calificación creada");
    success = true;
  } catch (error) {
    const apiError = error as ApiError;
    success = false;
    console.log("CREATE RATING API ERROR............", apiError);
    toast.error(
      apiError.response?.data?.message ||
        apiError.message ||
        "No se pudo crear la calificación"
    );
  }
  toast.dismiss(toastId);
  return success;
};

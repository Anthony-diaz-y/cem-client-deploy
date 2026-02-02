import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { categories, courseEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import {
  ApiResponse,
  CourseCategory,
  FullCourseDetailsResponse,
} from "./types";
import { isValidUUID } from "./utils";

const { GET_ALL_CATEGORIES_API } = categories;

const {
  COURSE_DETAILS_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
} = courseEndpoints;

interface CoursesListMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

interface GetAllCoursesFilters {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

interface GetAllCoursesResponse {
  success: boolean;
  data: unknown[];
  message?: string;
  meta?: CoursesListMeta;
}

// Obtener cursos (con soporte de paginación / búsqueda desde backend)
export const getAllCoursesWithMeta = async (filters?: GetAllCoursesFilters) => {
  let result: unknown[] = [];
  let meta: CoursesListMeta | undefined = undefined;

  try {
    const params: Record<string, string | number> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (typeof filters?.page === "number") params.page = filters.page;
    if (typeof filters?.limit === "number") params.limit = filters.limit;

    const response = await apiConnector<ApiResponse<GetAllCoursesResponse>>(
      "GET",
      GET_ALL_COURSE_API,
      undefined,
      undefined,
      Object.keys(params).length > 0 ? params : undefined,
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Courses");
    }

    const payload = response?.data?.data as unknown;
    // Si el backend ya retorna { data, meta } dentro de data, lo soportamos
    if (payload && typeof payload === "object" && "data" in (payload as any)) {
      result = ((payload as any).data || []) as unknown[];
      meta = (payload as any).meta as CoursesListMeta | undefined;
    } else {
      // Compatibilidad con respuesta antigua: data es el array
      result = (response?.data?.data || []) as unknown[];
    }

    // [FIX] Soporte para cuando meta está al mismo nivel que data (sibling)
    if (!meta && (response?.data as any)?.meta) {
      meta = (response.data as any).meta as CoursesListMeta;
    }
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.response?.status !== 401) {
      toast.error(apiError.message || "No se pudieron obtener los cursos");
    }
  }

  return { courses: result, meta };
};

// Obtener cursos (compatibilidad: retorna solo array)
export const getAllCourses = async () => {
  const { courses } = await getAllCoursesWithMeta();
  return courses;
};

// Obtener detalles de un curso
export const fetchCourseDetails = async (courseId: string) => {
  let result = null;

  try {
    if (!courseId || typeof courseId !== "string") {
      return null;
    }

    if (!isValidUUID(courseId)) {
      return null;
    }

    interface CourseDetailsData {
      courseDetails: unknown;
      [key: string]: unknown;
    }
    const response = await apiConnector<ApiResponse<CourseDetailsData>>(
      "POST",
      COURSE_DETAILS_API,
      { courseId } as Record<string, unknown>,
    );

    if (!response?.data) {
      return null;
    }

    if (!response.data.success) {
      const errorMessage =
        response.data.message || "Could not fetch course details";
      throw new Error(errorMessage);
    }

    if (response.data.data && response.data.data.courseDetails) {
      result = response.data;
    } else {
      return null;
    }
  } catch (error) {
    const apiError = error as ApiError;

    if (apiError.response?.status === 500) {
      return null;
    }

    result = apiError.response?.data || null;
  }
  return result;
};

// // Obtener categorías de cursos
// Obtener categorías de cursos
export const fetchCourseCategories = async (): Promise<CourseCategory[]> => {
  let result: CourseCategory[] = [];

  try {
    const response = await apiConnector<ApiResponse<CourseCategory[]>>(
      "GET",
      GET_ALL_CATEGORIES_API,
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = (response?.data?.data || []) as CourseCategory[];
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.response?.status !== 401) {
      toast.error(apiError.message || "No se pudieron obtener las categorías");
    }
  }
  return result;
};

// Crear curso
export const addCourseDetails = async (
  data: FormData | Record<string, unknown>,
  token: string,
) => {
  const toastId = toast.loading("Loading...");
  let result = null;

  try {
    const response = await apiConnector<ApiResponse>(
      "POST",
      CREATE_COURSE_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }

    result = response?.data?.data;

    if (typeof window !== "undefined") {
      const { invalidateInstructorCache } =
        await import("@modules/instructor/hooks/useInstructorData");
      invalidateInstructorCache();
      window.dispatchEvent(new CustomEvent("instructorDataRefresh"));
    }

    toast.success("Course Details Added Successfully");
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.message || "Could Not Add Course Details");
  }
  toast.dismiss(toastId);
  return result;
};

// Editar curso
export const editCourseDetails = async (
  data: FormData | Record<string, unknown>,
  token: string,
) => {
  let result = null;
  const toastId = toast.loading("Cargando...");

  try {
    const response = await apiConnector<ApiResponse>(
      "PUT",
      EDIT_COURSE_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }

    result = response?.data?.data;
    toast.success("Curso editado exitosamente");
  } catch (error) {
    toast.error("Error al editar el curso");
  }
  toast.dismiss(toastId);
  return result;
};

// Eliminar curso
export const deleteCourse = async (
  data: Record<string, unknown>,
  token: string,
) => {
  const toastId = toast.loading("Deleting course...");
  try {
    const courseId = data.courseId;
    if (!courseId || typeof courseId !== "string") {
      throw new Error("Course ID is required");
    }

    if (!isValidUUID(courseId)) {
      throw new Error("Invalid course ID format");
    }

    const response = await apiConnector<ApiResponse>(
      "DELETE",
      DELETE_COURSE_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      },
      { courseId: courseId as string },
    );
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Delete Course");
    }
    toast.success("Course Deleted");
  } catch (error) {
    const apiError = error as ApiError;

    if (apiError.response?.status === 400) {
      toast.error(apiError.response?.data?.message || "Invalid course ID");
    } else if (apiError.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else if (apiError.response?.status === 403) {
      toast.error("You don't have permission to delete this course");
    } else if (apiError.response?.status === 404) {
      toast.error("Course not found");
    } else if (apiError.response?.status === 500) {
      toast.error(
        apiError.response?.data?.message ||
          "Server error. Please try again later.",
      );
    } else {
      toast.error(
        apiError.response?.data?.message ||
          apiError.message ||
          "Could Not Delete Course",
      );
    }
  }
  toast.dismiss(toastId);
};

// Obtener detalles completos del curso
export const getFullDetailsOfCourse = async (
  courseId: string,
  token: string,
): Promise<FullCourseDetailsResponse | null> => {
  let result: FullCourseDetailsResponse | null = null;
  try {
    const response = await apiConnector<ApiResponse<FullCourseDetailsResponse>>(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      } as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = (response?.data?.data as FullCourseDetailsResponse) || null;
  } catch (error) {
    const apiError = error as ApiError;
    if (
      apiError.response?.data &&
      typeof apiError.response.data === "object" &&
      "courseDetails" in apiError.response.data
    ) {
      result = apiError.response.data as FullCourseDetailsResponse;
    } else {
      result = null;
    }
  }
  return result;
};

import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { adminEndpoints, categories } from "./apis";
import type { ApiError } from "@modules/auth/types";

const {
  ADMIN_DASHBOARD_API,
  PENDING_INSTRUCTORS_API,
  ALL_INSTRUCTORS_API,
  APPROVE_INSTRUCTOR_API,
  REJECT_INSTRUCTOR_API,
  PENDING_COURSES_API,
  ALL_COURSES_API,
  PUBLISH_COURSE_API,
  EDIT_COURSE_ADMIN_API,
  DELETE_COURSE_ADMIN_API,
} = adminEndpoints;

// ================ Types ================
export interface AdminDashboardStats {
  totalInstructors: number;
  approvedInstructors: number;
  pendingInstructors: number;
  totalStudents: number;
  unreadMessages?: number; // Nuevo campo del backend
}

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  approved: boolean;
  image?: string;
  createdAt: string;
  additionalDetails?: {
    gender?: string | null;
    dateOfBirth?: string | null;
    about?: string | null;
    contactNumber?: string | null;
  };
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardStats;
  message: string;
}

export interface PendingInstructorsResponse {
  success: boolean;
  data: Instructor[];
  message: string;
  count: number;
}

export interface AllInstructorsResponse {
  success: boolean;
  data: {
    all: Instructor[];
    approved: Instructor[];
    pending: Instructor[];
  };
  message: string;
  counts: {
    total: number;
    approved: number;
    pending: number;
  };
}

export interface ApproveInstructorResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    approved: boolean;
  };
}

// ================ Course Types ================
export interface CourseInstructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
}

export interface AdminCourse {
  id: string;
  courseName: string;
  courseDescription: string;
  price: number;
  thumbnail?: string;
  status: "Draft" | "Published";
  createdAt: string;
  updatedAt: string;
  instructor: CourseInstructor;
  category: CourseCategory;
  totalStudentsEnrolled?: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface PendingCoursesResponse {
  success: boolean;
  data: AdminCourse[];
  message: string;
  count: number;
}

export interface AllCoursesResponse {
  success: boolean;
  data: AdminCourse[];
  message: string;
  count: number;
}

export interface PublishCourseResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

export interface EditCourseResponse {
  success: boolean;
  message: string;
  data: AdminCourse;
}

export interface DeleteCourseResponse {
  success: boolean;
  message: string;
}

// ================ Get Admin Dashboard Stats ================
export async function getAdminDashboard(token: string): Promise<AdminDashboardStats | null> {
  try {
    const response = await apiConnector<AdminDashboardResponse>(
      "GET",
      ADMIN_DASHBOARD_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("ADMIN_DASHBOARD_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("ADMIN_DASHBOARD_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar estadísticas");
    return null;
  }
}

// ================ Get Pending Instructors ================
export async function getPendingInstructors(token: string): Promise<Instructor[]> {
  try {
    const response = await apiConnector<PendingInstructorsResponse>(
      "GET",
      PENDING_INSTRUCTORS_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("PENDING_INSTRUCTORS_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("PENDING_INSTRUCTORS_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar instructores pendientes");
    return [];
  }
}

// ================ Get All Instructors ================
export async function getAllInstructors(token: string): Promise<AllInstructorsResponse["data"] | null> {
  const toastId = toast.loading("Cargando instructores...");
  try {
    const response = await apiConnector<AllInstructorsResponse>(
      "GET",
      ALL_INSTRUCTORS_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("ALL_INSTRUCTORS_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("ALL_INSTRUCTORS_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar instructores");
    toast.dismiss(toastId);
    return null;
  }
}

// ================ Approve Instructor ================
export async function approveInstructor(
  instructorId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Aprobando instructor...");
  try {
    const response = await apiConnector<ApproveInstructorResponse>(
      "POST",
      APPROVE_INSTRUCTOR_API,
      { instructorId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("APPROVE_INSTRUCTOR_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Instructor aprobado exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("APPROVE_INSTRUCTOR_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al aprobar instructor");
    toast.dismiss(toastId);
    return false;
  }
}

// ================ Reject Instructor ================
export async function rejectInstructor(
  instructorId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Rechazando instructor...");
  try {
    const response = await apiConnector<ApproveInstructorResponse>(
      "POST",
      REJECT_INSTRUCTOR_API,
      { instructorId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("REJECT_INSTRUCTOR_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Instructor rechazado");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("REJECT_INSTRUCTOR_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al rechazar instructor");
    toast.dismiss(toastId);
    return false;
  }
}

// ================ Get Pending Courses ================
export async function getPendingCourses(token: string): Promise<AdminCourse[]> {
  const toastId = toast.loading("Cargando cursos pendientes...");
  try {
    const response = await apiConnector<PendingCoursesResponse>(
      "GET",
      PENDING_COURSES_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("PENDING_COURSES_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("PENDING_COURSES_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar cursos pendientes");
    toast.dismiss(toastId);
    return [];
  }
}

// ================ Get All Courses ================
export async function getAllCoursesAdmin(token: string): Promise<AdminCourse[]> {
  try {
    const response = await apiConnector<AllCoursesResponse>(
      "GET",
      ALL_COURSES_API,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("ALL_COURSES_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("ALL_COURSES_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar cursos");
    return [];
  }
}

// ================ Publish Course ================
export async function publishCourse(
  courseId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Publicando curso...");
  try {
    const response = await apiConnector<PublishCourseResponse>(
      "POST",
      PUBLISH_COURSE_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("PUBLISH_COURSE_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Curso publicado exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("PUBLISH_COURSE_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al publicar curso");
    toast.dismiss(toastId);
    return false;
  }
}

// ================ Edit Course (Admin) ================
export async function editCourseAdmin(
  courseId: string,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<AdminCourse | null> {
  const toastId = toast.loading("Editando curso...");
  try {
    // Si data es un objeto, agregar courseId
    const requestData = data instanceof FormData 
      ? (() => {
          const formData = new FormData();
          formData.append("courseId", courseId);
          // Copiar todos los campos del FormData original
          if (data instanceof FormData) {
            for (const [key, value] of data.entries()) {
              formData.append(key, value);
            }
          }
          return formData;
        })()
      : { ...data as Record<string, unknown>, courseId };

    const response = await apiConnector<EditCourseResponse>(
      "POST",
      EDIT_COURSE_ADMIN_API,
      requestData,
      {
        Authorization: `Bearer ${token}`,
        ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
      }
    );

    console.log("EDIT_COURSE_ADMIN_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Curso editado exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("EDIT_COURSE_ADMIN_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al editar curso");
    toast.dismiss(toastId);
    return null;
  }
}

// ================ Delete Course (Admin) ================
export async function deleteCourseAdmin(
  courseId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Eliminando curso...");
  try {
    const response = await apiConnector<DeleteCourseResponse>(
      "DELETE",
      DELETE_COURSE_ADMIN_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("DELETE_COURSE_ADMIN_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Curso eliminado exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE_COURSE_ADMIN_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al eliminar curso");
    toast.dismiss(toastId);
    return false;
  }
}

// ================ Create Category ================
export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    description: string;
  };
}

export async function createCategory(
  data: CreateCategoryRequest,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Creando categoría...");
  try {
    const response = await apiConnector<CreateCategoryResponse>(
      "POST",
      categories.CREATE_CATEGORY_API,
      data,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("CREATE_CATEGORY_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Categoría creada exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE_CATEGORY_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al crear categoría");
    toast.dismiss(toastId);
    return false;
  }
}


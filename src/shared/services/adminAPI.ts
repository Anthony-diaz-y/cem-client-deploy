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
  GET_INSTRUCTOR_DETAILS_API,
  TOGGLE_INSTRUCTOR_STATUS_API,
  UPDATE_INSTRUCTOR_API,
  PENDING_COURSES_API,
  ALL_COURSES_API,
  PUBLISH_COURSE_API,
  EDIT_COURSE_ADMIN_API,
  DELETE_COURSE_ADMIN_API,
  GET_COURSE_DETAILS_ADMIN_API,
  CREATE_REVIEW_ADMIN_API,
  UPDATE_REVIEW_ADMIN_API,
  DELETE_REVIEW_ADMIN_API,
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
  active?: boolean;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  additionalDetails?: {
    gender?: string | null;
    dateOfBirth?: string | null;
    about?: string | null;
    contactNumber?: string | null;
  };
  profile?: {
    id: string;
    gender?: string | null;
    dateOfBirth?: string | null;
    about?: string | null;
    contactNumber?: number | null;
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

export interface InstructorFilters {
  status?: "approved" | "pending" | "all";
  active?: boolean;
  search?: string;
}

export interface AllInstructorsResponse {
  success: boolean;
  data: {
    all: Instructor[];
    approved: Instructor[];
    pending: Instructor[];
    active?: Instructor[];
    inactive?: Instructor[];
  };
  message: string;
  counts: {
    total: number;
    approved: number;
    pending: number;
    active?: number;
    inactive?: number;
  };
}

export interface InstructorStatistics {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface InstructorCourse {
  id: string;
  courseName: string;
  status: "Published" | "Draft";
  price: number;
  totalStudents: number;
  revenue: number;
  averageRating: number;
  totalReviews: number;
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

export interface InstructorDetailsResponse {
  success: boolean;
  data: {
    instructor: Instructor;
    statistics: InstructorStatistics;
    courses: InstructorCourse[];
  };
  message: string;
}

export interface UpdateInstructorData {
  firstName?: string;
  lastName?: string;
  email?: string;
  approved?: boolean;
  contactNumber?: number | string | null; // El backend acepta number, string (se convierte a number) o null
}

export interface UpdateInstructorResponse {
  success: boolean;
  message: string;
  data: Instructor;
}

export interface ToggleInstructorStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
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

// ================ Course Details Types ================
export interface CourseDetailsCourseInfo {
  id: string;
  courseName: string;
  courseDescription: string;
  whatYouWillLearn: string;
  price: number;
  thumbnail: string;
  status: "Draft" | "Published";
  tag: string[];
  instructions: string[];
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    accountType: "Instructor";
  };
  category: {
    id: string;
    name: string;
    description: string;
  } | null;
}

export interface CourseDetailsStatistics {
  totalStudentsEnrolled: number;
  totalSubSections: number;
  totalSections: number;
  averageProgressPercentage: number;
  studentsCompleted: number;
  studentsInProgress: number;
  studentsNotStarted: number;
  totalDiscussions: number;
  totalDiscussionReplies: number;
  averageRating: number;
  totalReviews: number;
}

export interface EnrolledStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  enrolledAt: string | null;
  progress: {
    completedSubSections: number;
    totalSubSections: number;
    progressPercentage: number;
    isCompleted: boolean;
    completedVideosIds: string[];
  };
}

export interface DiscussionReply {
  id: string;
  reply: string;
  userId: string;
  userName: string;
  userAccountType: "Admin" | "Instructor" | "Student";
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionBySubSection {
  subSectionId: string;
  subSectionTitle: string;
  sectionName: string;
  totalQuestions: number;
  totalReplies: number;
  lastActivity: string | null;
  discussions: Array<{
    id: string;
    question: string;
    userId: string;
    userName: string;
    userAccountType: "Admin" | "Instructor" | "Student";
    repliesCount: number;
    createdAt: string;
    updatedAt: string;
    replies: DiscussionReply[];
  }>;
}

export interface CourseReview {
  id: string;
  rating: number;
  review: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailsData {
  course: CourseDetailsCourseInfo;
  statistics: CourseDetailsStatistics;
  enrolledStudents: EnrolledStudent[];
  discussionsBySubSection: DiscussionBySubSection[];
  reviews?: CourseReview[];
  editCourseEndpoint: string;
  courseId: string;
}

export interface CourseDetailsResponse {
  success: boolean;
  data: CourseDetailsData;
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

// ================ Get All Instructors (con filtros) ================
export async function getAllInstructors(
  token: string,
  filters?: InstructorFilters,
  silent = false // Si es true, no muestra toast de carga
): Promise<AllInstructorsResponse | null> {
  const toastId = silent ? null : toast.loading("Cargando instructores...");
  try {
    // Construir query parameters según la especificación del backend
    const params = new URLSearchParams();
    
    // Filtro por estado de aprobación (solo si no es 'all')
    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    
    // Filtro por estado activo (debe ser string 'true' o 'false')
    if (filters?.active !== undefined) {
      params.append("active", filters.active ? "true" : "false");
    }
    
    // Búsqueda (trimmeado para evitar espacios extra)
    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }

    const url = params.toString()
      ? `${ALL_INSTRUCTORS_API}?${params.toString()}`
      : ALL_INSTRUCTORS_API;

    const response = await apiConnector<AllInstructorsResponse>(
      "GET",
      url,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("ALL_INSTRUCTORS_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    if (toastId) toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("ALL_INSTRUCTORS_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar instructores");
    if (toastId) toast.dismiss(toastId);
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

// ================ Get Instructor Details ================
export async function getInstructorDetails(
  instructorId: string,
  token: string
): Promise<InstructorDetailsResponse["data"] | null> {
  const toastId = toast.loading("Cargando detalles del instructor...");
  try {
    const response = await apiConnector<InstructorDetailsResponse>(
      "GET",
      `${GET_INSTRUCTOR_DETAILS_API}/${instructorId}`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("GET_INSTRUCTOR_DETAILS_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("GET_INSTRUCTOR_DETAILS_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar detalles del instructor");
    toast.dismiss(toastId);
    return null;
  }
}

// ================ Toggle Instructor Status ================
export async function toggleInstructorStatus(
  instructorId: string,
  active: boolean,
  token: string
): Promise<boolean> {
  const toastId = toast.loading(active ? "Activando instructor..." : "Desactivando instructor...");
  try {
    const response = await apiConnector<ToggleInstructorStatusResponse>(
      "PUT",
      `${TOGGLE_INSTRUCTOR_STATUS_API}/${instructorId}/toggle-status`,
      { active },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("TOGGLE_INSTRUCTOR_STATUS_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || (active ? "Instructor activado exitosamente" : "Instructor desactivado exitosamente"));
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("TOGGLE_INSTRUCTOR_STATUS_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cambiar estado del instructor");
    toast.dismiss(toastId);
    return false;
  }
}

// ================ Update Instructor ================
export async function updateInstructor(
  instructorId: string,
  updates: UpdateInstructorData,
  token: string
): Promise<Instructor | null> {
  const toastId = toast.loading("Actualizando instructor...");
  try {
    // ✅ CRÍTICO: Construir el body explícitamente para asegurar que contactNumber esté presente
    const body: UpdateInstructorData = {};
    
    // Solo incluir campos que están definidos
    if (updates.firstName !== undefined) {
      body.firstName = updates.firstName;
    }
    if (updates.lastName !== undefined) {
      body.lastName = updates.lastName;
    }
    if (updates.email !== undefined) {
      body.email = updates.email;
    }
    if (updates.approved !== undefined) {
      body.approved = updates.approved;
    }
    
    // ✅ CRÍTICO: Incluir contactNumber si está definido (incluso si es null)
    // El backend necesita recibir null explícitamente para eliminar el número
    if (updates.contactNumber !== undefined) {
      // Convertir string vacío a null, o mantener number/null
      if (typeof updates.contactNumber === 'string') {
        body.contactNumber = updates.contactNumber.trim() === '' 
          ? null 
          : (parseInt(updates.contactNumber.trim(), 10) || null);
      } else {
        // Ya es number o null
        body.contactNumber = updates.contactNumber;
      }
    }
    
    // Verificar que contactNumber esté presente si fue proporcionado
    if (updates.contactNumber !== undefined && !('contactNumber' in body)) {
      // Error manejado silenciosamente - el backend validará
    }
    
    const response = await apiConnector<UpdateInstructorResponse>(
      "PUT",
      `${UPDATE_INSTRUCTOR_API}/${instructorId}`,
      body as Record<string, unknown>, // Convertir a Record para compatibilidad con apiConnector
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );


    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Instructor actualizado exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al actualizar instructor");
    toast.dismiss(toastId);
    return null;
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

// ================ Get Course Details (Admin) ================
export async function getCourseDetailsAdmin(
  courseId: string,
  token: string
): Promise<CourseDetailsData | null> {
  try {
    const response = await apiConnector<CourseDetailsResponse>(
      "GET",
      `${GET_COURSE_DETAILS_ADMIN_API}/${courseId}`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("GET_COURSE_DETAILS_ADMIN_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("GET_COURSE_DETAILS_ADMIN_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar detalles del curso");
    return null;
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
      data as unknown as Record<string, unknown>,
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

// ================ Review Management (Admin) ================
export interface CreateReviewRequest {
  courseId: string;
  rating: number;
  review: string;
}

export interface UpdateReviewRequest {
  rating: number;
  review: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: CourseReview;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    rating: number;
    review: string;
    userId: string;
    courseId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export async function createReviewAdmin(
  data: CreateReviewRequest,
  token: string
): Promise<CourseReview | null> {
  const toastId = toast.loading("Creando reseña...");
  try {
    const response = await apiConnector<ReviewResponse>(
      "POST",
      CREATE_REVIEW_ADMIN_API,
      data as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("CREATE_REVIEW_ADMIN_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Reseña creada exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("CREATE_REVIEW_ADMIN_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al crear reseña");
    toast.dismiss(toastId);
    return null;
  }
}

export async function updateReviewAdmin(
  reviewId: string,
  data: UpdateReviewRequest,
  token: string
): Promise<CourseReview | null> {
  const toastId = toast.loading("Actualizando reseña...");
  try {
    const response = await apiConnector<ReviewResponse>(
      "PUT",
      `${UPDATE_REVIEW_ADMIN_API}/${reviewId}`,
      data as unknown as Record<string, unknown>,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("UPDATE_REVIEW_ADMIN_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Reseña actualizada exitosamente");
    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("UPDATE_REVIEW_ADMIN_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al actualizar reseña");
    toast.dismiss(toastId);
    return null;
  }
}

export async function deleteReviewAdmin(
  reviewId: string,
  token: string
): Promise<boolean> {
  const toastId = toast.loading("Eliminando reseña...");
  try {
    const response = await apiConnector<DeleteReviewResponse>(
      "DELETE",
      `${DELETE_REVIEW_ADMIN_API}/${reviewId}`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("DELETE_REVIEW_ADMIN_API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message || "Reseña eliminada exitosamente");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("DELETE_REVIEW_ADMIN_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al eliminar reseña");
    toast.dismiss(toastId);
    return false;
  }
}


import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { adminEndpoints } from "./apis";
import type { ApiError } from "@modules/auth/types";

const {
  ADMIN_DASHBOARD_API,
  PENDING_INSTRUCTORS_API,
  ALL_INSTRUCTORS_API,
  APPROVE_INSTRUCTOR_API,
  REJECT_INSTRUCTOR_API,
} = adminEndpoints;

// ================ Types ================
export interface AdminDashboardStats {
  totalInstructors: number;
  approvedInstructors: number;
  pendingInstructors: number;
  totalStudents: number;
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

// ================ Get Admin Dashboard Stats ================
export async function getAdminDashboard(token: string): Promise<AdminDashboardStats | null> {
  const toastId = toast.loading("Cargando estadísticas...");
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

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("ADMIN_DASHBOARD_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar estadísticas");
    toast.dismiss(toastId);
    return null;
  }
}

// ================ Get Pending Instructors ================
export async function getPendingInstructors(token: string): Promise<Instructor[]> {
  const toastId = toast.loading("Cargando instructores pendientes...");
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

    toast.dismiss(toastId);
    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.log("PENDING_INSTRUCTORS_API ERROR............", apiError);
    toast.error(apiError.response?.data?.message || "Error al cargar instructores pendientes");
    toast.dismiss(toastId);
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


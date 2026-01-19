/**
 * Servicios de API para el Dashboard de Administración
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type { AdminDashboardStats, AdminDashboardResponse } from "./types";

const { ADMIN_DASHBOARD_API } = adminEndpoints;

/**
 * Obtiene las estadísticas del dashboard de administración
 * @param token - Token JWT de autenticación
 * @returns Estadísticas del dashboard o null en caso de error
 */
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

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.response?.data?.message || "Error al cargar estadísticas");
    return null;
  }
}


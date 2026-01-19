/**
 * Servicios de API para el Dashboard de Administración
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type { AdminDashboardData, AdminDashboardResponse } from "./types";

const { ADMIN_DASHBOARD_API } = adminEndpoints;

/**
 * Obtiene las estadísticas del dashboard de administración
 */
export async function getAdminDashboard(token: string, filter: string = "month"): Promise<AdminDashboardData | null> {
  try {
    const response = await apiConnector<AdminDashboardResponse>(
      "GET",
      `${ADMIN_DASHBOARD_API}?filter=${filter}`,
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


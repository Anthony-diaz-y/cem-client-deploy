import { apiConnector } from "@shared/services/apiConnector";
import { domains } from "@shared/services/apis";
import type { Domain } from "../types";

/** Obtiene todos los dominios con sus categorías desde la API */
export const getAllDomains = async (): Promise<Domain[]> => {
  try {
    const response = await apiConnector<any>(
      "GET",
      domains.GET_ALL_DOMAINS_API,
    );

    // Verificar si la respuesta viene envuelta en { success: true, data: [...] }
    if (response?.data?.success && Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    // Fallback: si por alguna razón el endpoint devolviera el array directo (comportamiento antiguo/raro)
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching domains:", error);
    return [];
  }
};

import { apiConnector } from "@shared/services/apiConnector";
import { domains } from "@shared/services/apis";
import type { Domain } from "../types";

/** Obtiene todos los dominios con sus categorías desde la API */
export const getAllDomains = async (): Promise<Domain[]> => {
  try {
    // El endpoint retorna el array de dominios directamente
    const response = await apiConnector<Domain[]>(
      "GET",
      domains.GET_ALL_DOMAINS_API,
    );

    // La respuesta es directamente el array de dominios
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching domains:", error);
    return [];
  }
};

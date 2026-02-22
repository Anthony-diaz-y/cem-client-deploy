import axios from "axios";
import { toast } from "react-hot-toast";
import { apiConnector } from "@shared/services/apiConnector";
import { domains } from "@shared/services/apis";
import type { Domain } from "../types";

export const getAllDomains = async (): Promise<Domain[]> => {
  try {
    const response = await apiConnector<{ success?: boolean; data?: Domain[] }>(
      "GET",
      domains.GET_ALL_DOMAINS_API,
    );

    if (response?.data?.success && Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    if (Array.isArray(response?.data)) {
      return response.data as Domain[];
    }

    return [];
  } catch (error) {
    const isNetworkError =
      axios.isAxiosError(error) &&
      (error.code === "ERR_NETWORK" || error.message === "Network Error");

    if (isNetworkError) {
      toast.error(
        "No se pudo conectar con el servidor. Comprueba que el backend esté corriendo (p. ej. en http://localhost:5000) y que NEXT_PUBLIC_API_URL en .env.local sea correcto.",
        { duration: 6000 },
      );
    }
    return [];
  }
};

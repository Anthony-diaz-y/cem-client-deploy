/**
 * Servicios de API para la búsqueda global (Admin)
 * Combina búsquedas en estudiantes, instructores y cursos
 */

import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";
import type { ApiError } from "@modules/auth/types";
import type { GlobalSearchResult } from "./types";
import type { AllStudentsResponse, AllInstructorsResponse, AllCoursesResponse } from "./types";

const { GLOBAL_SEARCH_API } = adminEndpoints;
const ALL_STUDENTS_API = "/admin/all-students";
const ALL_INSTRUCTORS_API = adminEndpoints.ALL_INSTRUCTORS_API;
const ALL_COURSES_API = adminEndpoints.ALL_COURSES_API;

/**
 * Realiza una búsqueda global en estudiantes, instructores y cursos
 * Usa los endpoints existentes y combina los resultados
 */
export async function globalSearch(
  token: string,
  query: string,
  silent = false
): Promise<GlobalSearchResult | null> {
  if (!query || !query.trim()) {
    return null;
  }

  const toastId = silent ? null : toast.loading("Buscando...");
  try {
    const searchQuery = query.trim();
    const params = new URLSearchParams();
    params.append("search", searchQuery);
    params.append("limit", "5");

    try {
      const globalResponse = await apiConnector<{ success: boolean; data: GlobalSearchResult; message: string }>(
        "GET",
        `${GLOBAL_SEARCH_API}?${params.toString()}`,
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (globalResponse.data.success) {
        if (toastId) toast.dismiss(toastId);
        return globalResponse.data.data;
      }
    } catch (globalError) {
      console.log("Endpoint de búsqueda global no disponible, usando búsquedas individuales");
    }

    const [studentsResponse, instructorsResponse, coursesResponse] = await Promise.allSettled([
      apiConnector<AllStudentsResponse>(
        "GET",
        `${ALL_STUDENTS_API}?${params.toString()}`,
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      ),
      apiConnector<AllInstructorsResponse>(
        "GET",
        `${ALL_INSTRUCTORS_API}?${params.toString()}`,
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      ),
      apiConnector<AllCoursesResponse>(
        "GET",
        `${ALL_COURSES_API}?${params.toString()}`,
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      ),
    ]);

    const results: GlobalSearchResult = {
      students: [],
      instructors: [],
      courses: [],
    };

    if (studentsResponse.status === "fulfilled" && studentsResponse.value.data.success) {
      results.students = studentsResponse.value.data.data.all || [];
    }

    if (instructorsResponse.status === "fulfilled" && instructorsResponse.value.data.success) {
      results.instructors = instructorsResponse.value.data.data.all || [];
    }

    if (coursesResponse.status === "fulfilled" && coursesResponse.value.data.success) {
      results.courses = coursesResponse.value.data.data || [];
    }

    if (toastId) toast.dismiss(toastId);
    return results;
  } catch (error) {
    const apiError = error as ApiError;
    if (!silent) {
      toast.error(apiError.response?.data?.message || "Error al realizar la búsqueda");
    }
    if (toastId) toast.dismiss(toastId);
    return null;
  }
}


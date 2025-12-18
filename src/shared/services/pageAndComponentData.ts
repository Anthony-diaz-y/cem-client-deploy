// import { toast } from "react-hot-toast"
import { apiConnector } from './apiConnector';
import { catalogData } from './apis';
import type { ApiError } from '@modules/auth/types';


// Función para validar UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// ================ get Catalog Page Data  ================
export const getCatalogPageData = async (categoryId: string) => {
  // const toastId = toast.loading("Loading...");
  let result = null;
  try {
    // Verificar que categoryId existe
    if (!categoryId) {
      console.error("Category ID is required");
      return null;
    }

    // Validar formato UUID antes de hacer la petición
    if (!isValidUUID(categoryId)) {
      console.error(
        "Invalid category ID format (expected UUID):", 
        categoryId,
        "\nThis looks like a MongoDB ObjectId. The backend uses PostgreSQL UUIDs."
      );
      return null;
    }

    console.log("Fetching catalog page data for categoryId (UUID):", categoryId);
    const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId });

    console.log("CATALOG PAGE DATA API RESPONSE............", response);

    // Verificar estructura de respuesta antes de desestructurar
    if (!response?.data) {
      console.error("Invalid response structure: response.data is undefined");
      return null;
    }

    // Si success es false, significa que no hay cursos para esta categoría
    if (!response.data.success) {
      console.log("No courses found for category:", response.data.message || "No message provided");
      // Retornar estructura vacía en lugar de null para mantener compatibilidad
      return {
        selectedCategory: { courses: [], name: "", description: "" },
        differentCategory: { courses: [], name: "", description: "" },
        mostSellingCourses: []
      };
    }

    // Si success es true, verificar que data existe antes de retornar
    if (response.data.data && typeof response.data.data === 'object') {
      result = response.data.data;
    } else {
      console.error("Invalid data structure in response");
      return null;
    }
  }
  catch (error) {
    const apiError = error as ApiError;
    console.error("CATALOG PAGE DATA API ERROR....", apiError);
    
    // Manejo específico de errores 500
    if (apiError.response?.status === 500) {
      console.error('Error del servidor (500):', apiError.response.data);
      throw new Error('Error del servidor. Por favor, intenta más tarde.');
    }
    
    // Si es un error de red u otro error, retornar null
    return null;
  }
  // toast.dismiss(toastId);
  return result;
}


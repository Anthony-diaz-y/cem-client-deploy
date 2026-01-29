/**
 * Configuración centralizada de la API
*/

const getApiUrl = (): string => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // Log en desarrollo para debug
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 API_URL configurada:", apiUrl);
  }

  // Advertencia si estamos en producción y usando localhost
  if (
    typeof window !== "undefined" &&
    apiUrl.includes("localhost") &&
    window.location.hostname !== "localhost"
  ) {
    console.error(
      "⚠️ ADVERTENCIA: Estás usando localhost en producción. Configura NEXT_PUBLIC_API_URL en Vercel.",
    );
  }

  return apiUrl;
};

export const API_URL = getApiUrl();

export default API_URL;

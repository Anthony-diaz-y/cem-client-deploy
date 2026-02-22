/**
 * Configuración centralizada de la API
*/

const getApiUrl = (): string => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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

import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/shared/config/api.config";

// Flag to enable/disable mock mode - DESACTIVADO para usar backend real
export const MOCK_MODE = false;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar token JWT a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    // Si hay un token en localStorage, agregarlo al header
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // El token puede estar almacenado como JSON string, parsearlo si es necesario
      let authToken = token;
      try {
        if (token) {
          authToken = JSON.parse(token);
        }
      } catch (e) {
        // Si no es JSON, usar el token directamente
        authToken = token;
      }
      
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si no está autenticado, limpiar localStorage y redirigir a login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Solo redirigir si no estamos ya en login
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper para obtener el token de localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    // El token puede estar almacenado como JSON string
    return JSON.parse(token);
  } catch {
    return token;
  }
};

// apiConnector principal - ahora usa el backend real
// Las URLs de apis.ts ya incluyen el BASE_URL completo, así que usamos axios directamente
const realApiConnector = <T = any>(
    method: string,
    url: string,
    bodyData?: Record<string, unknown> | FormData,
    headers?: Record<string, string>,
    params?: Record<string, string | number>
): Promise<AxiosResponse<T>> => {
    const token = getToken();
    
    // Si bodyData es FormData, no establecer Content-Type (el navegador lo hará automáticamente)
    const isFormData = bodyData instanceof FormData;
    const hasBody = bodyData !== undefined && bodyData !== null;
    
    const requestHeaders: Record<string, string> = {
      // Solo establecer Content-Type si hay bodyData, NO es FormData, y NO es GET/HEAD
      ...(hasBody && !isFormData && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD'
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...headers,
    };
    
    // Si headers ya tiene Content-Type y es FormData, eliminarlo para que el navegador lo establezca
    if (isFormData && requestHeaders['Content-Type']) {
      delete requestHeaders['Content-Type'];
    }
    
    // Agregar token si existe y no está ya en headers
    if (token && !headers?.Authorization) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    // Para métodos DELETE, algunos backends esperan los parámetros en query params
    // Si hay bodyData y el método es DELETE, intentar usar params también
    let finalParams: Record<string, string | number> | undefined = params;
    if (method.toUpperCase() === 'DELETE' && bodyData && !(bodyData instanceof FormData)) {
      // Para DELETE, agregar los datos del body a los params también
      // Convertir los valores a string o number para query params
      const convertedBodyData: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(bodyData)) {
        if (typeof value === 'string' || typeof value === 'number') {
          convertedBodyData[key] = value;
        } else if (value != null) {
          // Convertir otros tipos a string
          convertedBodyData[key] = String(value);
        }
      }
      finalParams = { ...params, ...convertedBodyData };
    }

    return axios<T>({
        method: `${method}`,
        url: url,
        data: bodyData ?? undefined,
        headers: requestHeaders,
        params: finalParams ?? undefined,
        withCredentials: true,
    });
};

// Export the apiConnector - ahora siempre usa el backend real
// Soporta tipos genéricos para type safety
export const apiConnector = <T = any>(
    method: string,
    url: string,
    bodyData?: Record<string, unknown> | FormData,
    headers?: Record<string, string>,
    params?: Record<string, string | number>
): Promise<AxiosResponse<T>> => {
    return realApiConnector<T>(method, url, bodyData, headers, params);
};
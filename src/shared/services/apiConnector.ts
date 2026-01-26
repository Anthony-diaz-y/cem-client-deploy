import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/shared/config/api.config";
import toast from "react-hot-toast";

export const MOCK_MODE = false;

let isHandling401 = false;
let redirectTimer: NodeJS.Timeout | null = null;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Agregar token JWT a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      let authToken = token;
      try {
        if (token) {
          authToken = JSON.parse(token);
        }
      } catch {
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

// Manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (isHandling401) {
        return Promise.reject(error);
      }

      isHandling401 = true;

      const errorData = error.response?.data || {};
      let errorMessage = '';
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = typeof errorData.error === 'string' ? errorData.error : errorData.error.message || '';
      }

      if (!errorMessage) {
        errorMessage = 'Tu sesión ha expirado';
      }

      const messageStr = String(errorMessage).toLowerCase();
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isAuthRoute =
        currentPath.includes('/auth/login') ||
        currentPath.includes('/login') ||
        currentPath.includes('/auth/signup') ||
        currentPath.includes('/signup') ||
        currentPath.includes('/auth/verify-email') ||
        currentPath.includes('/verify-email') ||
        currentPath.includes('/auth/forgot-password') ||
        currentPath.includes('/forgot-password') ||
        currentPath.includes('/auth/reset-password') ||
        currentPath.includes('/reset-password');

      if (isAuthRoute) {
        isHandling401 = false;
        return Promise.reject(error);
      }

      const isAccountDeactivated =
        messageStr.includes('desactivada') ||
        messageStr.includes('desactivado') ||
        messageStr.includes('inactiva') ||
        messageStr.includes('inactivo') ||
        messageStr.includes('ha sido desactivada') ||
        messageStr.includes('cuenta ha sido desactivada');

      const isPendingApproval =
        messageStr.includes('pendiente de aprobación') ||
        messageStr.includes('pending approval') ||
        messageStr.includes('pendiente');

      if (typeof window !== 'undefined') {
        localStorage.clear();
      }

      let toastMessage = '';
      let toastId = 'session-expired';
      const toastStyle = {
        background: '#ef4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
      };

      if (isAccountDeactivated) {
        toastMessage = 'Tu cuenta ha sido desactivada. Por favor, contacta al administrador.';
        toastId = 'account-deactivated';
      } else if (isPendingApproval) {
        toastMessage = 'Tu cuenta está pendiente de aprobación. Por favor, espera la aprobación del administrador.';
        toastId = 'pending-approval';
        toastStyle.background = '#f59e0b';
      } else {
        toastMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      }

      toast.error(toastMessage, {
        id: toastId,
        duration: 5000,
        style: toastStyle,
      });

      if (typeof window !== 'undefined') {
        if (redirectTimer) {
          clearTimeout(redirectTimer);
        }

        const currentPathForRedirect = window.location.pathname;
        if (!currentPathForRedirect.includes('/auth/login') && !currentPathForRedirect.includes('/login')) {
          redirectTimer = setTimeout(() => {
            window.location.replace('/auth/login');
            setTimeout(() => {
              isHandling401 = false;
            }, 1000);
          }, 5000);
        } else {
          setTimeout(() => {
            isHandling401 = false;
          }, 1000);
        }
      } else {
        setTimeout(() => {
          isHandling401 = false;
        }, 2000);
      }
    }
    return Promise.reject(error);
  }
);

// Obtener token de localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(token);
  } catch {
    return token;
  }
};

// Conector principal de API
const realApiConnector = async <T = unknown>(
  method: string,
  url: string,
  bodyData?: Record<string, unknown> | FormData,
  headers?: Record<string, string>,
  params?: Record<string, string | number>
): Promise<AxiosResponse<T>> => {
  const token = getToken();
  const isFormData = bodyData instanceof FormData;
  const hasBody = bodyData !== undefined && bodyData !== null;

  const requestHeaders: Record<string, string> = {
    ...(hasBody && !isFormData && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD'
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...headers,
  };

  if (isFormData && requestHeaders['Content-Type']) {
    delete requestHeaders['Content-Type'];
  }

  if (token && !headers?.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let finalParams: Record<string, string | number> | undefined = params;
  if (method.toUpperCase() === 'DELETE' && bodyData && !(bodyData instanceof FormData)) {
    const convertedBodyData: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(bodyData)) {
      if (typeof value === 'string' || typeof value === 'number') {
        convertedBodyData[key] = value;
      } else if (value != null) {
        convertedBodyData[key] = String(value);
      }
    }
    finalParams = { ...params, ...convertedBodyData };
  }

  try {
    const response = await axiosInstance<T>({
      method: `${method}`,
      url: url,
      data: bodyData ?? undefined,
      headers: requestHeaders,
      params: finalParams ?? undefined,
      withCredentials: true,
      timeout: 30000,
    });

    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const isDeleteCategoryWithCourses =
          method.toUpperCase() === 'DELETE' &&
          url.includes('/category/deleteCategory') &&
          error.response.status === 400 &&
          error.response.data?.courses &&
          Array.isArray(error.response.data.courses) &&
          error.response.data.courses.length > 0;

        if (!isDeleteCategoryWithCourses) {
          console.error('API Error:', {
            status: error.response.status,
            url,
            method: method.toUpperCase(),
            data: error.response.data,
            message: error.response.data?.message || error.message,
          });
        }
      }
    }

    throw error;
  }
};

// Conector de API con soporte de tipos genéricos
export const apiConnector = <T = unknown>(
  method: string,
  url: string,
  bodyData?: Record<string, unknown> | FormData,
  headers?: Record<string, string>,
  params?: Record<string, string | number>
): Promise<AxiosResponse<T>> => {
  return realApiConnector<T>(method, url, bodyData, headers, params);
};
import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { contactusEndpoint } from "./apis";
import type { ApiError } from "@modules/auth/types";

const {
  CONTACT_US_API,
  GET_CONTACT_MESSAGES_API,
  GET_CONTACT_STATS_API,
  MARK_MESSAGE_READ_API,
  ARCHIVE_MESSAGE_API,
  DELETE_MESSAGE_API,
} = contactusEndpoint;

// ================ Send Contact Message (Public) ================
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string; // Nuevo campo opcional
  subject?: string;
  message: string;
}

export const sendContactMessage = async (data: ContactFormData | Record<string, unknown>) => {
  const toastId = toast.loading("Enviando mensaje...", {
    id: "contact-loading",
  });
  let result = null;

  try {
    const response = await apiConnector("POST", CONTACT_US_API, data as Record<string, unknown>);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "No se pudo enviar el mensaje");
    }

    result = response.data.data;
    
    // Cerrar el toast de loading y mostrar éxito
    toast.dismiss("contact-loading");
    
    // Pequeño delay para asegurar que el toast de loading se cierre
    setTimeout(() => {
      toast.success(
        response.data.message || "¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.",
        {
          duration: 5000,
          id: "contact-success",
        }
      );
    }, 100);
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError?.response?.data?.message || apiError?.message || "No se pudo enviar el mensaje";
    
    // Cerrar el toast de loading
    toast.dismiss("contact-loading");
    
    // Pequeño delay para asegurar que el toast de loading se cierre
    setTimeout(() => {
      toast.error(errorMessage, {
        duration: 5000,
        id: "contact-error",
      });
    }, 100);
  }

  return result;
};

// ================ Get Contact Messages (Admin) ================
export interface Reply {
  id: string;
  replyMessage: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  replies?: Reply[]; // Array de respuestas del admin
  createdAt: string;
  updatedAt: string;
}

export interface GetMessagesParams {
  isRead?: boolean;
  isArchived?: boolean;
  isReplied?: boolean; // Nuevo filtro: true = respondidos, false = sin responder
  sortOrder?: "ASC" | "DESC"; // ASC = más antiguos primero, DESC = más recientes primero
}

export const getContactMessages = async (token: string, params?: GetMessagesParams) => {
  let result: ContactMessage[] = [];

  try {
    const queryParams = new URLSearchParams();
    if (params?.isRead !== undefined) {
      queryParams.append("isRead", params.isRead.toString());
    }
    if (params?.isArchived !== undefined) {
      queryParams.append("isArchived", params.isArchived.toString());
    }
    if (params?.isReplied !== undefined) {
      queryParams.append("isReplied", params.isReplied.toString());
    }
    if (params?.sortOrder) {
      queryParams.append("sortOrder", params.sortOrder);
    }

    const url = queryParams.toString() 
      ? `${GET_CONTACT_MESSAGES_API}?${queryParams.toString()}`
      : GET_CONTACT_MESSAGES_API;

    const response = await apiConnector("GET", url, undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      result = response.data.data || [];
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError?.response?.data?.message || "No se pudieron obtener los mensajes");
  }

  return result;
};

// ================ Get Contact Message by ID (Admin) ================
export const getContactMessage = async (messageId: string, token: string) => {
  let result: ContactMessage | null = null;

  try {
    const response = await apiConnector("GET", `${GET_CONTACT_MESSAGES_API}/${messageId}`, undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      result = response.data.data;
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError?.response?.data?.message || "No se pudo obtener el mensaje");
  }

  return result;
};

// ================ Get Contact Stats (Admin) ================
export interface ContactStats {
  total: number;
  unread: number;
  archived: number;
  read: number;
}

export const getContactStats = async (token: string) => {
  let result: ContactStats | null = null;

  try {
    const response = await apiConnector("GET", GET_CONTACT_STATS_API, undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      result = response.data.data;
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError?.response?.data?.message || "No se pudieron obtener las estadísticas");
  }

  return result;
};

// ================ Mark Message as Read (Admin) ================
export const markMessageAsRead = async (messageId: string, token: string) => {
  let result = false;
  const toastId = toast.loading("Marcando como leído...");

  try {
    const response = await apiConnector("PATCH", `${MARK_MESSAGE_READ_API}/${messageId}/read`, {}, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      toast.success(response.data.message || "Mensaje marcado como leído");
      result = true;
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError?.response?.data?.message || "No se pudo marcar el mensaje como leído");
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};

// ================ Archive Message (Admin) ================
export const archiveMessage = async (messageId: string, token: string) => {
  let result = false;
  const toastId = toast.loading("Archivando mensaje...");

  try {
    const response = await apiConnector("PATCH", `${ARCHIVE_MESSAGE_API}/${messageId}/archive`, {}, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      toast.success(response.data.message || "Mensaje archivado exitosamente");
      result = true;
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError?.response?.data?.message || "No se pudo archivar el mensaje");
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};

// ================ Delete Message (Admin) ================
export const deleteContactMessage = async (messageId: string, token: string) => {
  let result = false;
  const toastId = toast.loading("Eliminando mensaje...");

  try {
    const response = await apiConnector("DELETE", `${DELETE_MESSAGE_API}/${messageId}`, undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      toast.success(response.data.message || "Mensaje eliminado exitosamente");
      result = true;
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError?.response?.data?.message || "No se pudo eliminar el mensaje");
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};

// ================ Reply to Message (Admin) ================
export interface ReplyMessageData {
  replyMessage: string;
}

export const replyToMessage = async (messageId: string, replyMessage: string, token: string) => {
  let result = false;
  const toastId = toast.loading("Enviando respuesta...", {
    id: `reply-loading-${messageId}`,
  });

  try {
    const response = await apiConnector(
      "POST",
      `${GET_CONTACT_MESSAGES_API}/${messageId}/reply`,
      { replyMessage },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (response?.data?.success) {
      toast.dismiss(`reply-loading-${messageId}`);
      setTimeout(() => {
        toast.success(
          response.data.message || "Respuesta enviada exitosamente",
          {
            duration: 5000,
            id: `reply-success-${messageId}`,
          }
        );
      }, 100);
      result = true;
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.dismiss(`reply-loading-${messageId}`);
    setTimeout(() => {
      toast.error(
        apiError?.response?.data?.message || "No se pudo enviar la respuesta",
        {
          duration: 5000,
          id: `reply-error-${messageId}`,
        }
      );
    }, 100);
  }

  return result;
};

// ================ Unarchive Message (Admin) ================
export const unarchiveMessage = async (messageId: string, token: string) => {
  let result = false;
  const toastId = toast.loading("Desarchivando mensaje...");

  try {
    const response = await apiConnector("PATCH", `${ARCHIVE_MESSAGE_API}/${messageId}/unarchive`, {}, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      toast.success(response.data.message || "Mensaje desarchivado exitosamente");
      result = true;
    }
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError?.response?.data?.message || "No se pudo desarchivar el mensaje");
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};


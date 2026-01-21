import { toast } from "react-hot-toast";
import { apiConnector } from "@/shared/services/apiConnector";
import { API_ENDPOINTS } from "@/shared/config/api.config";
import type { 
  SubsectionDiscussion, 
  SubsectionDiscussionReply,
  DiscussionApiResponse 
} from "../types";

const { SUBSECTION_DISCUSSIONS } = API_ENDPOINTS;

/**
 * Crear una nueva pregunta/discusión
 */
export const createDiscussion = async (
  question: string,
  subSectionId: string
): Promise<SubsectionDiscussion | null> => {
  const toastId = toast.loading("Creando pregunta...");
  try {
    const response = await apiConnector<DiscussionApiResponse>(
      "POST",
      SUBSECTION_DISCUSSIONS.CREATE_DISCUSSION,
      {
        question,
        subSectionId,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Error al crear la pregunta");
    }

    toast.success(response.data.message || "Pregunta creada exitosamente", { id: toastId });
    return response.data.data as SubsectionDiscussion;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Error al crear la pregunta";
    toast.error(errorMessage, { id: toastId });
    console.error("CREATE_DISCUSSION API ERROR:", error);
    return null;
  }
};

/**
 * Obtener todas las discusiones de una subsección
 */
export const getDiscussions = async (
  subSectionId: string
): Promise<SubsectionDiscussion[]> => {
  try {
    const response = await apiConnector<DiscussionApiResponse>(
      "GET",
      `${SUBSECTION_DISCUSSIONS.GET_DISCUSSIONS}/${subSectionId}`
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Error al obtener las discusiones");
    }

    return (response.data.data as SubsectionDiscussion[]) || [];
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Error al obtener las discusiones";
    console.error("GET_DISCUSSIONS API ERROR:", error);
    toast.error(errorMessage);
    return [];
  }
};

/**
 * Actualizar una pregunta/discusión
 */
export const updateDiscussion = async (
  discussionId: string,
  question: string
): Promise<SubsectionDiscussion | null> => {
  const toastId = toast.loading("Actualizando pregunta...");
  try {
    const response = await apiConnector<DiscussionApiResponse>(
      "PUT",
      `${SUBSECTION_DISCUSSIONS.UPDATE_DISCUSSION}/${discussionId}`,
      { question }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Error al actualizar la pregunta");
    }

    toast.success(response.data.message || "Pregunta actualizada exitosamente", { id: toastId });
    return response.data.data as SubsectionDiscussion;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Error al actualizar la pregunta";
    toast.error(errorMessage, { id: toastId });
    console.error("UPDATE_DISCUSSION API ERROR:", error);
    return null;
  }
};

/**
 * Eliminar una pregunta/discusión
 * Ahora devuelve la lista completa de discusiones actualizada
 */
export const deleteDiscussion = async (discussionId: string): Promise<SubsectionDiscussion[] | null> => {
  const toastId = toast.loading("Eliminando pregunta...");
  try {
    const response = await apiConnector<DiscussionApiResponse>(
      "DELETE",
      `${SUBSECTION_DISCUSSIONS.DELETE_DISCUSSION}/${discussionId}`
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Error al eliminar la pregunta");
    }

    toast.success(response.data.message || "Pregunta eliminada exitosamente", { id: toastId });
    // El backend ahora devuelve la lista completa de discusiones actualizada
    return (response.data.data as SubsectionDiscussion[]) || null;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Error al eliminar la pregunta";
    toast.error(errorMessage, { id: toastId });
    console.error("DELETE_DISCUSSION API ERROR:", error);
    return null;
  }
};

/**
 * Crear una respuesta
 * Ahora devuelve la discusión completa actualizada
 */
export const createReply = async (
  reply: string,
  discussionId: string
): Promise<SubsectionDiscussion | null> => {
  const toastId = toast.loading("Enviando respuesta...");
  try {
    const response = await apiConnector<DiscussionApiResponse>(
      "POST",
      SUBSECTION_DISCUSSIONS.CREATE_REPLY,
      {
        reply,
        discussionId,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Error al crear la respuesta");
    }

    toast.success(response.data.message || "Respuesta creada exitosamente", { id: toastId });
    // El backend ahora devuelve la discusión completa actualizada
    return response.data.data as SubsectionDiscussion;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Error al crear la respuesta";
    toast.error(errorMessage, { id: toastId });
    console.error("CREATE_REPLY API ERROR:", error);
    return null;
  }
};

/**
 * Actualizar una respuesta
 * Ahora devuelve la discusión completa actualizada
 */
export const updateReply = async (
  replyId: string,
  reply: string
): Promise<SubsectionDiscussion | null> => {
  const toastId = toast.loading("Actualizando respuesta...");
  try {
    const response = await apiConnector<DiscussionApiResponse>(
      "PUT",
      `${SUBSECTION_DISCUSSIONS.UPDATE_REPLY}/${replyId}`,
      { reply }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Error al actualizar la respuesta");
    }

    toast.success(response.data.message || "Respuesta actualizada exitosamente", { id: toastId });
    // El backend ahora devuelve la discusión completa actualizada
    return response.data.data as SubsectionDiscussion;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Error al actualizar la respuesta";
    toast.error(errorMessage, { id: toastId });
    console.error("UPDATE_REPLY API ERROR:", error);
    return null;
  }
};

/**
 * Eliminar una respuesta
 * Ahora devuelve la discusión completa actualizada
 */
export const deleteReply = async (replyId: string): Promise<SubsectionDiscussion | null> => {
  const toastId = toast.loading("Eliminando respuesta...");
  try {
    const response = await apiConnector<DiscussionApiResponse>(
      "DELETE",
      `${SUBSECTION_DISCUSSIONS.DELETE_REPLY}/${replyId}`
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Error al eliminar la respuesta");
    }

    toast.success(response.data.message || "Respuesta eliminada exitosamente", { id: toastId });
    // El backend ahora devuelve la discusión completa actualizada
    return response.data.data as SubsectionDiscussion;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Error al eliminar la respuesta";
    toast.error(errorMessage, { id: toastId });
    console.error("DELETE_REPLY API ERROR:", error);
    return null;
  }
};

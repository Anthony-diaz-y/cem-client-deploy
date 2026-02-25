import { apiConnector } from "../apiConnector";
import { learningPathsEndpoints } from "../apis";
import {
  CreateLearningPathRequest,
  ListLearningPathsResponse,
  LearningPathResponse,
  UpdateLearningPathRequest,
} from "./types";
import { toast } from "react-hot-toast";

const {
  GET_ALL_LEARNING_PATHS_API,
  CREATE_LEARNING_PATH_API,
  UPDATE_LEARNING_PATH_API,
  DELETE_LEARNING_PATH_API,
  GET_LEARNING_PATH_DETAILS_API,
} = learningPathsEndpoints;

export const getAllLearningPaths = async (token: string) => {
  try {
    const response = await apiConnector<ListLearningPathsResponse>(
      "GET",
      GET_ALL_LEARNING_PATHS_API,
      undefined,
      { Authorization: `Bearer ${token}` },
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error: any) {
    console.error("GET_ALL_LEARNING_PATHS_API ERROR...", error);
    toast.error(error.message || "Error al obtener rutas de aprendizaje");
    return [];
  }
};

export const createLearningPath = async (
  data: CreateLearningPathRequest,
  token: string,
) => {
  const toastId = toast.loading("Creando ruta...");
  try {
    const response = await apiConnector<LearningPathResponse>(
      "POST",
      CREATE_LEARNING_PATH_API,
      data as any,
      { Authorization: `Bearer ${token}` },
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Ruta de aprendizaje creada");
    return response.data.data;
  } catch (error: any) {
    console.error("CREATE_LEARNING_PATH_API ERROR...", error);
    toast.error(error.message || "Error al crear ruta de aprendizaje");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const updateLearningPath = async (
  id: string,
  data: UpdateLearningPathRequest,
  token: string,
) => {
  const toastId = toast.loading("Actualizando ruta...");
  try {
    const response = await apiConnector<LearningPathResponse>(
      "PUT",
      `${UPDATE_LEARNING_PATH_API}/${id}`,
      data as any,
      { Authorization: `Bearer ${token}` },
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Ruta de aprendizaje actualizada");
    return response.data.data;
  } catch (error: any) {
    console.error("UPDATE_LEARNING_PATH_API ERROR...", error);
    toast.error(error.message || "Error al actualizar ruta de aprendizaje");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const deleteLearningPath = async (id: string, token: string) => {
  const toastId = toast.loading("Eliminando ruta...");
  try {
    const response = await apiConnector<{ success: boolean; message: string }>(
      "DELETE",
      `${DELETE_LEARNING_PATH_API}/${id}`,
      undefined,
      { Authorization: `Bearer ${token}` },
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Ruta de aprendizaje eliminada");
    return true;
  } catch (error: any) {
    console.error("DELETE_LEARNING_PATH_API ERROR...", error);
    toast.error(error.message || "Error al eliminar ruta de aprendizaje");
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};

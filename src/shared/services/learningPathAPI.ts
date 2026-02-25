import { apiConnector } from "./apiConnector";
import { learningPathsEndpoints } from "./apis";
import { ListLearningPathsResponse } from "./admin/types";

export const getPublicLearningPaths = async () => {
  try {
    const response = await apiConnector<ListLearningPathsResponse>(
      "GET",
      learningPathsEndpoints.GET_ALL_LEARNING_PATHS_API,
      undefined,
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error) {
    console.error("GET_PUBLIC_LEARNING_PATHS_API ERROR...", error);
    return [];
  }
};

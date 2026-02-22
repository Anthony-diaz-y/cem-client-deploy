import { useState, useEffect, useCallback } from "react";
import { getAllLearningPaths } from "@shared/services/admin/learningPaths";
import { LearningPath } from "@shared/services/admin/types";

interface UseLearningPathsReturn {
  learningPaths: LearningPath[];
  loading: boolean;
  refreshLearningPaths: () => Promise<void>;
}

export function useLearningPaths(token: string | null): UseLearningPathsReturn {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLearningPaths = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllLearningPaths(token);
      setLearningPaths(data || []);
    } catch (error) {
      setLearningPaths([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLearningPaths();
  }, [fetchLearningPaths]);

  return {
    learningPaths,
    loading,
    refreshLearningPaths: fetchLearningPaths,
  };
}

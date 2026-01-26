import { useState, useEffect, useCallback } from "react";
import { getAllCategories, Category } from "@shared/services/adminAPI";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
}

export function useCategories(token: string | null): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllCategories(token);
      setCategories(data || []);
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    refreshCategories: fetchCategories,
  };
}



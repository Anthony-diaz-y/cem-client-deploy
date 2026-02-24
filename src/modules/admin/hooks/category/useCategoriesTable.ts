import { useState, useEffect, useCallback } from "react";
import {
  Category,
  getCategoryCourses,
} from "@shared/services/adminAPI";
import type { CourseItem } from "../../components/category/types";

interface CategoryWithCourses extends Category {
  courses?: CourseItem[];
  expanded?: boolean;
  loading?: boolean;
  courseCount?: number;
}

interface UseCategoriesTableProps {
  categories: Category[];
  token: string;
  onUpdate: () => void;
}

export function useCategoriesTable({
  categories,
  token,
}: UseCategoriesTableProps) {
  const [categoriesWithCourses, setCategoriesWithCourses] = useState<
    CategoryWithCourses[]
  >([]);

  const loadInitialCourseCounts = useCallback(async () => {
    const toFetch = categories.filter((c) => c.courseCount === undefined);
    if (toFetch.length === 0) return;

    const countsPromises = toFetch.map(async (cat) => {
      try {
        const result = await getCategoryCourses(cat.id, token);
        return {
          categoryId: cat.id,
          count: result?.courses?.length || 0,
        };
      } catch {
        return {
          categoryId: cat.id,
          count: 0,
        };
      }
    });

    const counts = await Promise.all(countsPromises);

    setCategoriesWithCourses((prev) =>
      prev.map((cat) => {
        const countData = counts.find((c) => c.categoryId === cat.id);
        if (!countData) return cat;
        return {
          ...cat,
          courseCount: countData.count,
        };
      }),
    );
  }, [categories, token]);

  useEffect(() => {
    setCategoriesWithCourses((prev) => {
      const existingState = new Map(prev.map((cat) => [cat.id, cat]));

      return categories.map((cat) => {
        const existing = existingState.get(cat.id);
        if (existing) {
          return {
            ...cat,
            courses: existing.courses,
            expanded: existing.expanded,
            loading: existing.loading,
            courseCount: existing.courseCount ?? 0,
          };
        }
        return {
          ...cat,
          expanded: false,
          courses: [],
          loading: false,
          courseCount: 0,
        };
      });
    });

    loadInitialCourseCounts();
  }, [categories, loadInitialCourseCounts]);

  const loadCategoryCourses = useCallback(
    async (categoryId: string) => {
      setCategoriesWithCourses((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, loading: true } : cat,
        ),
      );

      try {
        const result = await getCategoryCourses(categoryId, token);
        if (result) {
          const rawCourses = result.courses || [];
          const coursesList: CourseItem[] = rawCourses.map((c) => ({
            id: c.id,
            courseName: c.courseName,
            status: c.status,
            instructor: c.instructor
              ? {
                id: c.instructor.id,
                firstName: c.instructor.name?.split(" ")[0] || "",
                lastName:
                  c.instructor.name?.split(" ").slice(1).join(" ") || "",
                email: c.instructor.email || "",
              }
              : {
                id: "no-instructor",
                firstName: "Sin",
                lastName: "Instructor",
                email: "",
              },
            createdAt: c.createdAt,
          }));
          setCategoriesWithCourses((prev) =>
            prev.map((cat) =>
              cat.id === categoryId
                ? {
                  ...cat,
                  courses: coursesList,
                  courseCount: coursesList.length,
                  loading: false,
                }
                : cat,
            ),
          );
        } else {
          setCategoriesWithCourses((prev) =>
            prev.map((cat) =>
              cat.id === categoryId ? { ...cat, loading: false } : cat,
            ),
          );
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        setCategoriesWithCourses((prev) =>
          prev.map((cat) =>
            cat.id === categoryId ? { ...cat, loading: false } : cat,
          ),
        );
      }
    },
    [token],
  );

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const targetCategory = categoriesWithCourses.find(
        (c) => c.id === categoryId,
      );
      const willExpand = !targetCategory?.expanded;
      const needsToLoad =
        willExpand &&
        (!targetCategory?.courses || targetCategory.courses.length === 0);

      setCategoriesWithCourses((prev) => {
        return prev.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              expanded: willExpand,
              loading: needsToLoad ? true : cat.loading,
            };
          }
          if (willExpand) {
            return { ...cat, expanded: false };
          }
          return cat;
        });
      });

      if (needsToLoad) {
        loadCategoryCourses(categoryId);
      }
    },
    [loadCategoryCourses, categoriesWithCourses],
  );

  return {
    categoriesWithCourses,
    toggleCategory,
  };
}

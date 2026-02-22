import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Category,
  getCategoryCourses,
  changeCourseCategory,
  getPublicCategories,
} from "@shared/services/adminAPI";
import type { CourseItem } from "../../components/category/types";

interface CategoryWithCourses extends Category {
  courses?: CourseItem[];
  expanded?: boolean;
  loading?: boolean;
  courseCount?: number;
}

interface MoveConfirmation {
  courseId: string;
  courseName: string;
  targetCategoryId: string;
  targetCategoryName: string;
  sourceCategoryId: string;
}

interface UseCategoriesTableProps {
  categories: Category[];
  token: string;
  onUpdate: () => void;
}

export function useCategoriesTable({
  categories,
  token,
  onUpdate,
}: UseCategoriesTableProps) {
  const [categoriesWithCourses, setCategoriesWithCourses] = useState<
    CategoryWithCourses[]
  >([]);
  const [draggedCourse, setDraggedCourse] = useState<{
    courseId: string;
    sourceCategoryId: string;
    courseName: string;
  } | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [moveConfirmation, setMoveConfirmation] =
    useState<MoveConfirmation | null>(null);

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

  const handleDragStart = useCallback(
    (
      e: React.DragEvent,
      courseId: string,
      sourceCategoryId: string,
      courseName: string,
    ) => {
      e.stopPropagation();
      setDraggedCourse({ courseId, sourceCategoryId, courseName });
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", courseId);
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, categoryId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggedCourse && draggedCourse.sourceCategoryId !== categoryId) {
        setDragOverCategory(categoryId);
      }
    },
    [draggedCourse],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;

    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }

    setDragOverCategory(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetCategoryId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (
        !draggedCourse ||
        draggedCourse.sourceCategoryId === targetCategoryId
      ) {
        setDraggedCourse(null);
        setDragOverCategory(null);
        return;
      }

      const courseId = draggedCourse.courseId;
      const sourceCategoryId = draggedCourse.sourceCategoryId;
      const courseName = draggedCourse.courseName;

      setDragOverCategory(null);

      const targetCategory = categoriesWithCourses.find(
        (c) => c.id === targetCategoryId,
      );
      const isMoveToSector = targetCategory?.type === "sector";

      if (isMoveToSector) {
        setMoveConfirmation({
          courseId,
          courseName,
          targetCategoryId,
          targetCategoryName: targetCategory?.name || "esta categoría",
          sourceCategoryId,
        });
        setDraggedCourse(null);
        return;
      }

      // Optimistic update for Career to Career move (where it DOES disappear from source)
      setCategoriesWithCourses((prev) =>
        prev.map((cat) => {
          if (cat.id === sourceCategoryId) {
            const newCourses =
              cat.courses?.filter((c) => c.id !== courseId) || [];
            return {
              ...cat,
              courses: newCourses,
              courseCount: Math.max(0, (cat.courseCount || 0) - 1),
            };
          }
          if (cat.id === targetCategoryId) {
            const sourceCat = prev.find((c) => c.id === sourceCategoryId);
            const course = sourceCat?.courses?.find((c) => c.id === courseId);
            if (course) {
              const updatedCourses = [...(cat.courses || []), course];
              return {
                ...cat,
                courses: updatedCourses,
                courseCount: updatedCourses.length,
              };
            }
          }
          return cat;
        }),
      );

      try {
        const success = await changeCourseCategory(
          courseId,
          targetCategoryId,
          token,
          true,
        );

        if (success) {
          toast.success(
            `"${courseName}" movido a "${targetCategory?.name || "nueva categoría"}"`,
          );

          await Promise.all([
            loadCategoryCourses(sourceCategoryId),
            loadCategoryCourses(targetCategoryId),
          ]);

          try {
            await getPublicCategories();
          } catch {
            console.error("Error al refrescar categorías públicas");
          }
        } else {
          await Promise.all([
            loadCategoryCourses(sourceCategoryId),
            loadCategoryCourses(targetCategoryId),
          ]);
        }
      } catch {
        toast.error(`No se pudo mover "${courseName}"`);
        await Promise.all([
          loadCategoryCourses(sourceCategoryId),
          loadCategoryCourses(targetCategoryId),
        ]);
      }

      setDraggedCourse(null);
    },
    [draggedCourse, token, loadCategoryCourses, categoriesWithCourses],
  );

  const confirmMove = useCallback(async () => {
    if (!moveConfirmation) return;

    const {
      courseId,
      targetCategoryId,
      sourceCategoryId,
      courseName,
      targetCategoryName,
    } = moveConfirmation;
    setMoveConfirmation(null);

    // Optimistic update (adding only, NOT removing from source since it's a sector)
    setCategoriesWithCourses((prev) =>
      prev.map((cat) => {
        if (cat.id === targetCategoryId) {
          const sourceCat = prev.find((c) => c.id === sourceCategoryId);
          const course = sourceCat?.courses?.find((c) => c.id === courseId);
          if (course) {
            const updatedCourses = [...(cat.courses || []), course];
            return {
              ...cat,
              courses: updatedCourses,
              courseCount: updatedCourses.length,
            };
          }
        }
        return cat;
      }),
    );

    try {
      const success = await changeCourseCategory(
        courseId,
        targetCategoryId,
        token,
        true,
      );

      if (success) {
        toast.success(
          `"${courseName}" también asignado a "${targetCategoryName}"`,
        );
        await Promise.all([
          loadCategoryCourses(sourceCategoryId),
          loadCategoryCourses(targetCategoryId),
        ]);
        try {
          await getPublicCategories();
        } catch {
          console.error("Error al refrescar categorías públicas");
        }
      }
    } catch {
      toast.error(`No se pudo mover "${courseName}"`);
      await Promise.all([
        loadCategoryCourses(sourceCategoryId),
        loadCategoryCourses(targetCategoryId),
      ]);
    }
  }, [moveConfirmation, token, loadCategoryCourses]);

  const cancelMove = useCallback(() => {
    setMoveConfirmation(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCourse(null);
    setDragOverCategory(null);
  }, []);

  return {
    categoriesWithCourses,
    draggedCourse,
    dragOverCategory,
    moveConfirmation,
    confirmMove,
    cancelMove,
    toggleCategory,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}

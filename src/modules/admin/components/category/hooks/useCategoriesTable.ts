/**
 * Hook personalizado para manejar la lógica de la tabla de categorías
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Category,
  getCategoryCourses,
  changeCourseCategory,
  getPublicCategories,
} from "@shared/services/adminAPI";
import type { CourseItem } from "../types";

interface CategoryWithCourses extends Category {
  courses?: CourseItem[];
  expanded?: boolean;
  loading?: boolean;
  courseCount?: number; // Contador de cursos independiente de si están cargados o no
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
  const [categoriesWithCourses, setCategoriesWithCourses] = useState<CategoryWithCourses[]>([]);
  const [draggedCourse, setDraggedCourse] = useState<{
    courseId: string;
    sourceCategoryId: string;
    courseName: string;
  } | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  /**
   * Carga el contador de cursos para todas las categorías al inicializar
   */
  const loadInitialCourseCounts = useCallback(async () => {
    const countsPromises = categories.map(async (cat) => {
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
        return {
          ...cat,
          courseCount: countData?.count ?? 0,
        };
      })
    );
  }, [categories, token]);

  // Inicializar categorías con estado expandido/colapsado y cargar conteos iniciales
  useEffect(() => {
    setCategoriesWithCourses(
      categories.map((cat) => ({
        ...cat,
        expanded: false,
        courses: [],
        loading: false,
        courseCount: 0, // Inicializar en 0, se actualizará cuando se carguen los conteos
      }))
    );
    
    // Cargar conteos iniciales
    loadInitialCourseCounts();
  }, [categories, loadInitialCourseCounts]);

  /**
   * Carga los cursos de una categoría
   */
  const loadCategoryCourses = useCallback(
    async (categoryId: string) => {
      setCategoriesWithCourses((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, loading: true } : cat
        )
      );

      try {
        const result = await getCategoryCourses(categoryId, token);
        if (result) {
          const coursesList = result.courses || [];
          setCategoriesWithCourses((prev) =>
            prev.map((cat) =>
              cat.id === categoryId
                ? {
                    ...cat,
                    courses: coursesList,
                    courseCount: coursesList.length, // Actualizar contador cuando se cargan los cursos
                    loading: false,
                  }
                : cat
            )
          );
        }
      } catch {
        setCategoriesWithCourses((prev) =>
          prev.map((cat) =>
            cat.id === categoryId ? { ...cat, loading: false } : cat
          )
        );
      }
    },
    [token]
  );

  /**
   * Alterna la expansión de una categoría
   */
  const toggleCategory = useCallback(
    async (categoryId: string) => {
      setCategoriesWithCourses((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryId) {
            const willExpand = !cat.expanded;
            // Si se va a expandir y no hay cursos cargados, cargarlos
            if (willExpand && (!cat.courses || cat.courses.length === 0)) {
              loadCategoryCourses(categoryId);
            }
            return { ...cat, expanded: willExpand };
          }
          return cat;
        })
      );
    },
    [loadCategoryCourses]
  );

  /**
   * Inicia el arrastre de un curso
   */
  const handleDragStart = useCallback(
    (e: React.DragEvent, courseId: string, sourceCategoryId: string, courseName: string) => {
      e.stopPropagation();
      setDraggedCourse({ courseId, sourceCategoryId, courseName });
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", courseId);
    },
    []
  );

  /**
   * Maneja cuando se arrastra sobre una categoría
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent, categoryId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggedCourse && draggedCourse.sourceCategoryId !== categoryId) {
        setDragOverCategory(categoryId);
      }
    },
    [draggedCourse]
  );

  /**
   * Maneja cuando se sale del área de arrastre
   * Usa relatedTarget para evitar que se dispare cuando el mouse entra a elementos hijos
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Verificar si realmente salimos del contenedor o solo entramos a un elemento hijo
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    // Si relatedTarget está dentro del currentTarget, no hacer nada (solo cambió de hijo)
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }
    
    // Solo limpiar si realmente salimos del contenedor
    setDragOverCategory(null);
  }, []);

  /**
   * Maneja cuando se suelta un curso en una categoría
   */
  const handleDrop = useCallback(
    async (e: React.DragEvent, targetCategoryId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedCourse || draggedCourse.sourceCategoryId === targetCategoryId) {
        setDraggedCourse(null);
        setDragOverCategory(null);
        return;
      }

      const courseId = draggedCourse.courseId;
      const sourceCategoryId = draggedCourse.sourceCategoryId;
      const courseName = draggedCourse.courseName;

      setDragOverCategory(null);

      // Mover el curso visualmente inmediatamente y actualizar contadores
      setCategoriesWithCourses((prev) =>
        prev.map((cat) => {
          if (cat.id === sourceCategoryId) {
            const newCourses = cat.courses?.filter((c) => c.id !== courseId) || [];
            return {
              ...cat,
              courses: newCourses,
              courseCount: Math.max(0, (cat.courseCount || 0) - 1), // Decrementar contador
            };
          }
          if (cat.id === targetCategoryId) {
            // Encontrar el curso original
            const sourceCat = prev.find((c) => c.id === sourceCategoryId);
            const course = sourceCat?.courses?.find((c) => c.id === courseId);
            if (course) {
              return {
                ...cat,
                courses: [...(cat.courses || []), course],
                courseCount: (cat.courseCount || 0) + 1, // Incrementar contador
              };
            }
          }
          return cat;
        })
      );

      // Mover el curso en el backend (modo silencioso para evitar toast duplicado)
      try {
        const success = await changeCourseCategory(
          courseId,
          targetCategoryId,
          token,
          true // Modo silencioso - el componente maneja el toast
        );

        if (success) {
          // Mostrar toast corto y claro desde el componente
          const sourceCategory = categoriesWithCourses.find((c) => c.id === sourceCategoryId);
          const targetCategory = categoriesWithCourses.find((c) => c.id === targetCategoryId);
          toast.success(
            `"${courseName}" movido a "${targetCategory?.name || "nueva categoría"}"`
          );

          // Refrescar cursos de ambas categorías (esto también actualizará los contadores)
          await Promise.all([
            loadCategoryCourses(sourceCategoryId),
            loadCategoryCourses(targetCategoryId),
          ]);

          // Refrescar categorías públicas
          try {
            await getPublicCategories();
          } catch {
            console.error("Error al refrescar categorías públicas");
          }
        } else {
          // Revertir el cambio visual si falló
          await Promise.all([
            loadCategoryCourses(sourceCategoryId),
            loadCategoryCourses(targetCategoryId),
          ]);
        }
      } catch {
        toast.error(`No se pudo mover "${courseName}"`);
        // Revertir el cambio visual si falló
        await Promise.all([
          loadCategoryCourses(sourceCategoryId),
          loadCategoryCourses(targetCategoryId),
        ]);
      }

      setDraggedCourse(null);
    },
    [draggedCourse, token, loadCategoryCourses, categoriesWithCourses]
  );

  /**
   * Maneja el final del arrastre
   */
  const handleDragEnd = useCallback(() => {
    setDraggedCourse(null);
    setDragOverCategory(null);
  }, []);

  return {
    categoriesWithCourses,
    draggedCourse,
    dragOverCategory,
    toggleCategory,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}


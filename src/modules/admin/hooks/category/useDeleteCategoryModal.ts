import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Category,
  getAllCategories,
  getCategoryCourses,
  changeCourseCategory,
  changeMultipleCoursesCategory,
  deleteCategory,
  deleteCourseAdmin,
  deleteMultipleCourses,
  getPublicCategories,
} from "@shared/services/adminAPI";
import type { CourseItem } from "../../components/category/types";

interface UseDeleteCategoryModalProps {
  category: Category | null;
  token: string;
  onSuccess: (updatedCategories?: Category[]) => void;
  onClose: () => void;
}

export function useDeleteCategoryModal({
  category,
  token,
  onSuccess,
  onClose,
}: UseDeleteCategoryModalProps) {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [otherCategories, setOtherCategories] = useState<Category[]>([]);
  const [processingCourse, setProcessingCourse] = useState<string | null>(null);
  const [courseCategoryMap, setCourseCategoryMap] = useState<Record<string, string>>({});
  const [selectedCategoryForAll, setSelectedCategoryForAll] = useState<string>("");
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteCourseModal, setDeleteCourseModal] = useState<{
    isOpen: boolean;
    courseId: string | null;
    courseName: string;
  }>({
    isOpen: false,
    courseId: null,
    courseName: "",
  });

  const loadData = useCallback(async () => {
    if (!category) return;

    setLoading(true);
    try {
      const [coursesResult, categoriesResult] = await Promise.all([
        getCategoryCourses(category.id, token),
        getAllCategories(token),
      ]);

      if (coursesResult) {
        setCourses(coursesResult.courses);
      }

      if (categoriesResult) {
        const others = categoriesResult.filter((cat) => cat.id !== category.id);
        setOtherCategories(others);

        if (others.length > 0) {
          setSelectedCategoryForAll(others[0].id);

          const initialMap: Record<string, string> = {};
          coursesResult?.courses.forEach((course) => {
            initialMap[course.id] = others[0].id;
          });
          setCourseCategoryMap(initialMap);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [category, token]);

  const resetState = useCallback(() => {
    setCourses([]);
    setOtherCategories([]);
    setCourseCategoryMap({});
    setProcessingCourse(null);
    setSelectedCategoryForAll("");
  }, []);

  useEffect(() => {
    if (category) {
      loadData();
    } else {
      resetState();
    }
  }, [category, loadData, resetState]);

  const handleChangeCourseCategory = useCallback(
    async (courseId: string) => {
      const newCategoryId = courseCategoryMap[courseId];
      if (!newCategoryId) return;

      setProcessingCourse(courseId);
      try {
        const success = await changeCourseCategory(courseId, newCategoryId, token, true);
        if (success) {
          setCourses((prev) => prev.filter((c) => c.id !== courseId));
        }
      } catch {
      } finally {
        setProcessingCourse(null);
      }
    },
    [courseCategoryMap, token]
  );

  const handleDeleteCourseClick = useCallback((courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setDeleteCourseModal({
        isOpen: true,
        courseId,
        courseName: course.courseName,
      });
    }
  }, [courses]);

  const handleDeleteCourse = useCallback(async () => {
    if (!deleteCourseModal.courseId) return;

    const courseId = deleteCourseModal.courseId;
    setProcessingCourse(courseId);
    try {
      const success = await deleteCourseAdmin(courseId, token);
      if (success) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
        toast.success("Curso eliminado exitosamente");
        setDeleteCourseModal({ isOpen: false, courseId: null, courseName: "" });
      }
    } catch {
    } finally {
      setProcessingCourse(null);
    }
  }, [deleteCourseModal.courseId, token]);

  const handleMoveAllCourses = useCallback(async () => {
    if (otherCategories.length === 0 || !selectedCategoryForAll) {
      toast.error("Por favor, selecciona una categoría destino");
      return;
    }

    const coursesToMove = courses.filter((c) => processingCourse !== c.id);
    if (coursesToMove.length === 0) return;

    setProcessingCourse("all");
    try {
      const changes = coursesToMove.map((course) => ({
        courseId: course.id,
        newCategoryId: selectedCategoryForAll,
      }));

      const result = await changeMultipleCoursesCategory(changes, token, true);

      if (result && result.success && result.data) {
        const successfulCourseIds = new Set(result.data.successful.map((s) => s.courseId));
        const remainingCourses = courses.filter((c) => !successfulCourseIds.has(c.id));
        const allMovedSuccessfully = result.data.failedCount === 0 && remainingCourses.length === 0;

        setCourses(remainingCourses);

        if (allMovedSuccessfully) {
          toast.success("Cursos reasignados. Ya puedes eliminar la categoría.");

          await new Promise((resolve) => setTimeout(resolve, 500));

          if (category) {
            const updatedCoursesResult = await getCategoryCourses(category.id, token);
            if (updatedCoursesResult) {
              setCourses(updatedCoursesResult.courses);

              if (updatedCoursesResult.courses.length === 0) {
              } else {
                console.warn("⚠️ El backend aún muestra cursos después de moverlos.");
                setCourses([]);
              }
            }
          }
        } else if (result.data.failedCount > 0) {
          const failedCourseNames = result.data.failed
            .map((f) => {
              const course = coursesToMove.find((c) => c.id === f.courseId);
              return course?.courseName;
            })
            .filter(Boolean)
            .join(", ");

          if (failedCourseNames) {
            toast.error(`No se pudieron mover: ${failedCourseNames}`, { duration: 5000 });
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
          if (category) {
            const updatedCoursesResult = await getCategoryCourses(category.id, token);
            if (updatedCoursesResult) {
              setCourses(updatedCoursesResult.courses);
            }
          }
        }
      } else if (result && !result.success) {
        toast.error(result.message || "Algunos cursos no se pudieron mover");

        await new Promise((resolve) => setTimeout(resolve, 500));
        if (category) {
          const updatedCoursesResult = await getCategoryCourses(category.id, token);
          if (updatedCoursesResult) {
            setCourses(updatedCoursesResult.courses);
          }
        }
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (category) {
        try {
          const updatedCoursesResult = await getCategoryCourses(category.id, token);
          if (updatedCoursesResult) {
            setCourses(updatedCoursesResult.courses);
          }
        } catch {
        }
      }
    } finally {
      setProcessingCourse(null);
    }
  }, [otherCategories, selectedCategoryForAll, courses, processingCourse, token, category]);

  const handleDeleteCategory = useCallback(async () => {
    if (courses.length > 0) {
      toast.error("No se puede eliminar la categoría. Aún tiene cursos asociados.");
      return;
    }

    setProcessingCourse("category");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (category) {
        const verifyCourses = await getCategoryCourses(category.id, token);
        if (verifyCourses && verifyCourses.courses.length > 0) {
          setCourses(verifyCourses.courses);

          if (otherCategories.length === 0) {
            const categoriesResult = await getAllCategories(token);
            if (categoriesResult) {
              const others = categoriesResult.filter((cat) => cat.id !== category.id);
              setOtherCategories(others);

              if (others.length > 0) {
                setSelectedCategoryForAll(others[0].id);
                const initialMap: Record<string, string> = {};
                verifyCourses.courses.forEach((course) => {
                  initialMap[course.id] = others[0].id;
                });
                setCourseCategoryMap(initialMap);
              }
            }
          }

          toast.error("No se puede eliminar la categoría. Aún tiene cursos asociados.");
          setProcessingCourse(null);
          return;
        }
      }

      const result = await deleteCategory(category!.id, token);
      if (result.success) {
        try {
          await getPublicCategories();
        } catch {
          console.error("Error al refrescar categorías públicas");
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('categoriesUpdated', { 
            detail: { categories: result.categories } 
          }));
        }

        if (result.categories) {
          onSuccess(result.categories);
        } else {
          onSuccess();
        }
        onClose();
      } else if (result.courses && result.courses.length > 0) {
        const convertedCourses: CourseItem[] = result.courses.map((c) => ({
          id: c.id,
          courseName: c.nombre,
          status: c.estado as "Published" | "Draft",
          instructor: {
            id: "",
            firstName: c.instructor.split(" ")[0] || "",
            lastName: c.instructor.split(" ").slice(1).join(" ") || "",
            email: "",
          },
          createdAt: "",
        }));

        setCourses(convertedCourses);

        if (otherCategories.length === 0) {
          const categoriesResult = await getAllCategories(token);
          if (categoriesResult) {
            const others = categoriesResult.filter((cat) => cat.id !== category!.id);
            setOtherCategories(others);

            if (others.length > 0) {
              setSelectedCategoryForAll(others[0].id);
              const initialMap: Record<string, string> = {};
              convertedCourses.forEach((course) => {
                initialMap[course.id] = others[0].id;
              });
              setCourseCategoryMap(initialMap);
            }
          }
        }

        toast(result.message || "Esta categoría tiene cursos asociados. Debes reasignarlos antes de eliminar.", { icon: "ℹ️" });
      }
    } catch {
    } finally {
      setProcessingCourse(null);
    }
  }, [courses.length, category, token, otherCategories.length, onSuccess, onClose]);

  const handleDeleteAllCourses = useCallback(async () => {
    if (!category || courses.length === 0) return;

    const courseIds = courses.map((course) => course.id);

    try {
      const result = await deleteMultipleCourses(courseIds, token);

      if (result.success || result.successful.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (category) {
          const updatedCourses = await getCategoryCourses(category.id, token);
          if (updatedCourses) {
            setCourses(updatedCourses.courses);

            if (updatedCourses.courses.length === 0) {
              toast.success("Todos los cursos fueron eliminados. Ahora puedes eliminar la categoría.");
            }
          }
        }

        const successfulSet = new Set(result.successful);
        setCourses((prev) => prev.filter((c) => !successfulSet.has(c.id)));

        if (result.failed.length > 0) {
          toast.error(
            `${result.successful.length} curso(s) eliminados, ${result.failed.length} fallaron.`
          );
        }
      } else {
        throw new Error("No se pudo eliminar ningún curso");
      }
    } catch (error) {
      throw error;
    }
  }, [category, courses, token]);

  return {
    courses,
    loading,
    otherCategories,
    processingCourse,
    courseCategoryMap,
    setCourseCategoryMap,
    selectedCategoryForAll,
    setSelectedCategoryForAll,
    showDeleteAllModal,
    setShowDeleteAllModal,
    deleteCourseModal,
    setDeleteCourseModal,
    handleChangeCourseCategory,
    handleDeleteCourseClick,
    handleDeleteCourse,
    handleMoveAllCourses,
    handleDeleteCategory,
    handleDeleteAllCourses,
  };
}



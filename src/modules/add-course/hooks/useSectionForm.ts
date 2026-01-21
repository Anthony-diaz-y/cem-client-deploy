import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "@shared/services/courseDetailsAPI";
import { setCourse } from "@modules/course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { Course } from "../../course/types";
import { CourseBuilderFormData } from "../types";

/**
 * Custom hook for section form logic
 * Separates form handling logic from component
 */
export const useSectionForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseBuilderFormData>();

  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState<string | null>(null);

  // Función para validar UUID
  const isValidUUID = (id: string): boolean => {
    if (!id || typeof id !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Función para normalizar la estructura del curso (subSections -> subSection)
  const normalizeCourseStructure = (course: any): Course => {
    if (!course || !course.courseContent) return course;

    const normalizedContent = course.courseContent.map((section: any) => {
      // Si tiene subSections (con S mayúscula), convertir a subSection
      if (section.subSections && Array.isArray(section.subSections) && !section.subSection) {
        return {
          ...section,
          subSection: section.subSections,
        };
      }
      // Si tiene ambos, priorizar subSection
      if (section.subSection && Array.isArray(section.subSection)) {
        return section;
      }
      // Si no tiene ninguno, asegurar que subSection sea un array vacío
      return {
        ...section,
        subSection: section.subSections || section.subSection || [],
      };
    });

    return {
      ...course,
      courseContent: normalizedContent,
    };
  };

  const onSubmit = async (data: CourseBuilderFormData) => {
    if (!token) {
      toast.error('Debes iniciar sesión para agregar secciones');
      return;
    }

    if (!course) {
      toast.error('No hay un curso seleccionado. Por favor, crea un curso primero.');
      return;
    }

    const courseData = course as Course;
    const courseId = (courseData as any)?.id || courseData?._id;

    if (!courseId || courseId === 'undefined' || courseId === 'null' || courseId === '') {
      toast.error('ID de curso inválido. Por favor, crea el curso primero.');
      return;
    }

    if (!isValidUUID(courseId)) {
      toast.error('ID de curso inválido. Por favor, crea el curso nuevamente.');
      return;
    }

    const sectionName = data.sectionName?.trim();
    if (!sectionName || sectionName === '') {
      toast.error('El nombre de la sección es requerido');
      return;
    }

    if (editSectionName) {
      // Update section (keep existing logic)
      setLoading(true);
      try {
        const result = await updateSection(
          {
            sectionName: sectionName,
            sectionId: editSectionName,
            courseId: courseId,
          },
          token
        );

        if (result) {
          const normalizedResult = normalizeCourseStructure(result);
          dispatch(setCourse(normalizedResult));
          setEditSectionName(null);
          setValue("sectionName", "");
          toast.success('Sección actualizada exitosamente');
        }
      } catch (error: any) {
        console.error("Error updating section:", error);
        toast.error(error?.response?.data?.message || 'Error al actualizar la sección');
      } finally {
        setLoading(false);
      }
    } else {
      // Create section with toast.promise
      const createPromise = async () => {
        const result = await createSection(
          { sectionName: sectionName, courseId: courseId },
          token,
          true // suppressToast
        );

        // Backend returns updatedCourseDetails directly
        if (!result) {
          throw new Error("No se pudo crear la sección");
        }

        const normalizedResult = normalizeCourseStructure(result);
        dispatch(setCourse(normalizedResult));
        setEditSectionName(null);
        setValue("sectionName", "");
        return "Sección creada exitosamente";
      };

      setLoading(true);
      toast.promise(
        createPromise(),
        {
          loading: 'Creando sección...',
          success: (msg) => msg,
          error: (err) => err?.message || 'Error al crear la sección',
        },
        {
          style: { minWidth: '250px' },
          success: { duration: 3000 },
        }
      ).catch((error) => {
        console.error("Error creating section:", error);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const handleChangeEditSectionName = (
    sectionId: string,
    sectionName: string
  ) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return {
    register,
    handleSubmit,
    errors,
    loading,
    editSectionName,
    onSubmit,
    cancelEdit,
    handleChangeEditSectionName,
  };
};

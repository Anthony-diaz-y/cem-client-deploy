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

    // Validar que hay un curso seleccionado
    if (!course) {
      toast.error('No hay un curso seleccionado. Por favor, crea un curso primero.');
      return;
    }

    const courseData = course as Course;
    
    // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
    const courseId = (courseData as any)?.id || courseData?._id;

    // Validar que courseId existe y es válido
    if (!courseId || courseId === 'undefined' || courseId === 'null' || courseId === '') {
      console.error('Course ID is required and must be a valid UUID');
      toast.error('ID de curso inválido. Por favor, crea el curso primero.');
      return;
    }

    // Validar formato UUID
    if (!isValidUUID(courseId)) {
      console.error('Invalid course ID format (expected UUID):', courseId);
      toast.error('ID de curso inválido. Por favor, crea el curso nuevamente.');
      return;
    }

    // Validar que sectionName no esté vacío
    const sectionName = data.sectionName?.trim();
    if (!sectionName || sectionName === '') {
      toast.error('El nombre de la sección es requerido');
      return;
    }

    setLoading(true);
    let result;

    try {
      if (editSectionName) {
        result = await updateSection(
          {
            sectionName: sectionName,
            sectionId: editSectionName,
            courseId: courseId,
          },
          token
        );
      } else {
        result = await createSection(
          { sectionName: sectionName, courseId: courseId },
          token
        );
      }

      if (result) {
        // El backend devuelve updatedCourseDetails que puede tener subSections en lugar de subSection
        // Necesitamos normalizar la estructura para asegurar consistencia
        const normalizedResult = normalizeCourseStructure(result);
        
        console.log("Normalized course after section creation:", normalizedResult);
        dispatch(setCourse(normalizedResult));
        setEditSectionName(null);
        setValue("sectionName", "");
        toast.success('Sección ' + (editSectionName ? 'actualizada' : 'creada') + ' exitosamente');
      }
    } catch (error: any) {
      console.error("Error submitting section:", error);
      
      // Manejo específico de errores
      if (error?.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Error al ' + (editSectionName ? 'actualizar' : 'crear') + ' la sección';
        toast.error(errorMessage);
      } else if (error?.response?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
      } else if (error?.response?.status === 403) {
        toast.error('No tienes permisos para agregar secciones. Debes ser instructor.');
      } else {
        toast.error(error?.response?.data?.message || error?.message || 'Error al procesar la sección');
      }
    } finally {
      setLoading(false);
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

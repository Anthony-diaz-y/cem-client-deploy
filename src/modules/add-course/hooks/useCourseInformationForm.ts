import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
  getFullDetailsOfCourse,
} from "@shared/services/courseDetailsAPI";
import { setCourse, setStep } from "@modules/course/store/courseSlice";
import { COURSE_STATUS } from "@shared/utils/constants";
import { RootState } from "@shared/store/store";
import { Course } from "../../course/types";
import { CourseInformationFormData } from "../types";

// Función para normalizar la estructura del curso (subSections -> subSection)
const normalizeCourseStructure = (course: any): Course => {
  if (!course || !course.courseContent) return course;
  
  const normalizedContent = course.courseContent.map((section: any) => {
    // Si tiene subSections (con S mayúscula), convertir a subSection
    if (section.subSections && Array.isArray(section.subSections)) {
      return {
        ...section,
        subSection: section.subSections,
      };
    }
    // Si no tiene subSection, asegurar que sea un array vacío
    if (!section.subSection) {
      return {
        ...section,
        subSection: [],
      };
    }
    return section;
  });
  
  return {
    ...course,
    courseContent: normalizedContent,
  };
};

/**
 * Custom hook for course information form logic
 * Separates form handling logic from component
 */
export const useCourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CourseInformationFormData>();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { course, editCourse } = useSelector(
    (state: RootState) => state.course
  );
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState<
    Array<{ id?: string; _id?: string; name: string }>
  >([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const categories = await fetchCourseCategories();
        if (categories.length > 0) {
          setCourseCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (editCourse && course) {
      const courseData = course as Course;
      
      // Reinicializar el formulario completamente con los datos más recientes del curso
      // Esto asegura que siempre use los datos actualizados del Redux store
      
      // Normalizar y obtener todos los valores actuales del curso
      const currentCategoryId = String((courseData.category as any)?.id || (courseData.category as any)?._id || '').trim();
      
      // Establecer todos los valores del formulario de una vez para evitar inconsistencias
      const formValues = {
        courseTitle: courseData.courseName || '',
        courseShortDesc: courseData.courseDescription || '',
        coursePrice: courseData.price !== undefined ? courseData.price : 0,
        courseTags: courseData.tag || [],
        courseBenefits: courseData.whatYouWillLearn || '',
        courseCategory: (currentCategoryId && currentCategoryId !== 'undefined' && currentCategoryId !== 'null' && currentCategoryId !== '' && currentCategoryId !== 'NaN') ? currentCategoryId : '',
        courseRequirements: courseData.instructions || [],
        courseImage: courseData.thumbnail || '',
      };
      
      // Establecer todos los valores de una vez usando setValue múltiple
      Object.entries(formValues).forEach(([key, value]) => {
        setValue(key as keyof CourseInformationFormData, value as any, { 
          shouldValidate: false, 
          shouldDirty: false,
          shouldTouch: false 
        });
      });
      
      console.log("🔄 Formulario reinicializado con categoría:", currentCategoryId, "| Nombre categoría:", (courseData.category as any)?.name);
    }

    getCategories();
  }, [course, editCourse, setValue]);

  const isFormUpdated = (): boolean => {
    if (!course) return false;
    const courseData = course as Course;
    const currentValues = getValues();

    return (
      currentValues.courseTitle !== courseData.courseName ||
      currentValues.courseShortDesc !== courseData.courseDescription ||
      currentValues.coursePrice !== courseData.price ||
      currentValues.courseTags.toString() !== courseData.tag.toString() ||
      currentValues.courseBenefits !== courseData.whatYouWillLearn ||
      currentValues.courseCategory !== ((courseData.category as any)?.id || courseData.category?._id) ||
      currentValues.courseRequirements.toString() !==
        courseData.instructions.toString() ||
      currentValues.courseImage !== courseData.thumbnail
    );
  };

  const onSubmit = async (data: CourseInformationFormData) => {
    if (!token) return;

    if (editCourse) {
      if (isFormUpdated() && course) {
        const courseData = course as Course;
        const currentValues = getValues();
        
        // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
        const courseId = (courseData as any)?.id || courseData?._id;
        
        if (!courseId) {
          toast.error("ID de curso no encontrado");
          return;
        }
        
        const formData = new FormData();
        formData.append("courseId", courseId);

        if (currentValues.courseTitle !== courseData.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== courseData.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== courseData.price) {
          formData.append("price", data.coursePrice.toString());
        }
        if (currentValues.courseTags.toString() !== courseData.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== courseData.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        // SIEMPRE enviar categoryId si está presente y es válido
        // Esto asegura que el backend reciba el cambio de categoría correctamente
        const newCategoryId = String(data.courseCategory || '').trim();
        const courseCategoryId = String((courseData.category as any)?.id || (courseData.category as any)?._id || '').trim();
        
        if (newCategoryId && newCategoryId !== 'undefined' && newCategoryId !== 'null' && newCategoryId !== '' && newCategoryId !== 'NaN') {
          // Validar formato UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(newCategoryId)) {
            // SIEMPRE enviar el categoryId del formulario, incluso si parece igual
            // Esto asegura sincronización con el backend
            formData.append("categoryId", newCategoryId);
            console.log("✅ Enviando categoryId al backend:", newCategoryId, "| Categoría actual en Redux:", courseCategoryId);
          } else {
            console.error("❌ Invalid category ID format when editing course:", newCategoryId);
          }
        } else {
          console.warn("⚠️ No se puede enviar categoryId - valor inválido:", newCategoryId);
        }
        if (
          currentValues.courseRequirements.toString() !==
          courseData.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== courseData.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }

        setLoading(true);
        try {
          const result = await editCourseDetails(formData, token);
          if (result) {
            // Recargar el curso completo desde el backend para asegurar que el Redux store tenga los datos actualizados
            // Esto es especialmente importante para la categoría que puede haber cambiado
            const courseId = (courseData as any)?.id || courseData?._id;
            if (courseId && token) {
              try {
                const fullCourseDetails = await getFullDetailsOfCourse(courseId, token);
                if (fullCourseDetails?.courseDetails) {
                  // Normalizar la estructura del curso
                  const normalizedCourse = normalizeCourseStructure(fullCourseDetails.courseDetails);
                  dispatch(setCourse(normalizedCourse));
                } else {
                  // Si no se puede recargar, usar el resultado del edit
                  dispatch(setCourse(result));
                }
              } catch (refreshError) {
                console.error("Error refreshing course after edit:", refreshError);
                // Si falla la recarga, usar el resultado del edit
                dispatch(setCourse(result));
              }
            } else {
              dispatch(setCourse(result));
            }
            
            dispatch(setStep(2));
          }
        } catch (error) {
          console.error("Error updating course:", error);
          toast.error("Failed to update course");
        } finally {
          setLoading(false);
        }
      } else {
        // Si no hay cambios, simplemente avanzar al siguiente paso
        dispatch(setStep(2));
      }
      return;
    }

    // courseCategory es un string (el ID) desde el select
    const categoryId = data.courseCategory;
    
    // Validar que categoryId existe y es válido
    if (!categoryId || categoryId === '' || categoryId === 'undefined' || categoryId === 'null') {
      console.error('Category ID is required and must be a valid UUID');
      console.error('Received categoryId:', categoryId, 'Type:', typeof categoryId);
      toast.error('Por favor, selecciona una categoría válida');
      return;
    }

    // Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
      console.error('Invalid category ID format (expected UUID):', categoryId);
      toast.error('ID de categoría inválido. Por favor, selecciona una categoría válida');
      return;
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice.toString());
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("categoryId", categoryId); // Cambiado de "category" a "categoryId" y usando id/_id correctamente
    // El campo status ya no es necesario - el backend siempre crea el curso como Draft
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage);

    setLoading(true);
    try {
      const result = await addCourseDetails(formData, token);
      if (result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    loading,
    courseCategories,
    editCourse,
    onSubmit,
  };
};

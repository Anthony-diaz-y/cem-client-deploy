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

// Helper to safely extract category ID whether it's an object or array
export const getCategoryIds = (cat: any): { carreraId: string, sectorId: string } => {
  const result = { carreraId: "", sectorId: "" };
  if (!cat) return result;

  const categories = Array.isArray(cat) ? cat : [cat];

  categories.forEach((c: any) => {
    const domainName = c.domain?.name?.toLowerCase();
    const id = c.id || c._id || (typeof c === "string" ? c : "");
    if (!id) return;

    if (domainName === "carreras") {
      result.carreraId = id;
    } else if (domainName === "sectores") {
      result.sectorId = id;
    } else if (!result.carreraId) {
      // Fallback: first one with no domain info or unknown domain goes to carrera
      result.carreraId = id;
    }
  });

  return result;
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
    (state: RootState) => state.course,
  );
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState<
    Array<{ id?: string; _id?: string; name: string; domain?: { name: string } }>
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
      const { carreraId, sectorId } = getCategoryIds(courseData.category);

      // Establecer todos los valores del formulario de una vez para evitar inconsistencias
      const formValues = {
        courseTitle: courseData.courseName || "",
        courseShortDesc: courseData.courseDescription || "",
        coursePrice: courseData.price !== undefined ? courseData.price : 0,
        coursePrice_int: courseData.price !== undefined ? Math.floor(courseData.price).toString() : "0",
        coursePrice_cents: courseData.price !== undefined ? (courseData.price % 1).toFixed(2).split(".")[1] : "00",
        coursePriceUSD: courseData.priceUSD !== undefined ? courseData.priceUSD : 0,
        coursePriceUSD_int: courseData.priceUSD !== undefined ? Math.floor(courseData.priceUSD).toString() : "",
        coursePriceUSD_cents: courseData.priceUSD !== undefined ? (courseData.priceUSD % 1).toFixed(2).split(".")[1] : "",
        courseTags: courseData.tag || [],
        courseBenefits: courseData.whatYouWillLearn || "",
        courseCategory: carreraId,
        courseSector: sectorId,
        courseRequirements: courseData.instructions || [],
        courseInstructor:
          (courseData as any).instructors?.map((i: any) => i.id || i._id) || [],
        courseImage: courseData.thumbnail || "",
        courseSyllabus: (courseData as any).syllabus || "",
        courseVideoUrl: courseData.promoVideoUrl || "",
      };

      // Establecer todos los valores de una vez usando setValue múltiple
      Object.entries(formValues).forEach(([key, value]) => {
        setValue(key as keyof CourseInformationFormData, value as any, {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });
      });

      // Log only for debugging if needed, simplified for production
      // console.log("Form reinitialized with category:", currentCategoryId);
    }

    getCategories();
  }, [course, editCourse, setValue]);

  const isFormUpdated = (): boolean => {
    if (!course) return false;
    const courseData = course as Course;
    const currentValues = getValues();

    // Normalizar ID de categoría para comparación
    const { carreraId: currentCourseCarreraId, sectorId: currentCourseSectorId } = getCategoryIds(courseData.category);

    // Normalizar instructores para comparación (IDs solamente)
    const currentFormInstructors = Array.isArray(currentValues.courseInstructor)
      ? [...currentValues.courseInstructor].sort().toString()
      : "";
    const currentCourseInstructors = Array.isArray((courseData as any).instructors)
      ? (courseData as any).instructors.map((i: any) => i.id || i._id).sort().toString()
      : "";

    return (
      currentValues.courseTitle !== courseData.courseName ||
      currentValues.courseShortDesc !== courseData.courseDescription ||
      currentValues.coursePrice_int !== Math.floor(courseData.price || 0).toString() ||
      currentValues.coursePrice_cents !== ((courseData.price || 0) % 1).toFixed(2).split(".")[1] ||
      (currentValues.coursePriceUSD_int ?? "") !== (courseData.priceUSD !== undefined ? Math.floor(courseData.priceUSD).toString() : "") ||
      (currentValues.coursePriceUSD_cents ?? "") !== (courseData.priceUSD !== undefined ? (courseData.priceUSD % 1).toFixed(2).split(".")[1] : "") ||
      (currentValues.courseTags ?? []).toString() !== (courseData.tag ?? []).toString() ||
      currentValues.courseBenefits !== courseData.whatYouWillLearn ||
      currentValues.courseCategory !== currentCourseCarreraId ||
      currentValues.courseSector !== currentCourseSectorId ||
      (currentValues.courseRequirements ?? []).toString() !==
      (courseData.instructions ?? []).toString() ||
      currentFormInstructors !== currentCourseInstructors ||
      currentValues.courseImage !== courseData.thumbnail ||
      currentValues.courseSyllabus !== ((courseData as any).syllabus || "") ||
      currentValues.courseVideoUrl !== (courseData.promoVideoUrl || "")
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
        const combinedPrice = parseFloat(`${data.coursePrice_int || "0"}.${data.coursePrice_cents || "00"}`);
        const combinedPriceUSD = (data.coursePriceUSD_int || data.coursePriceUSD_cents)
          ? parseFloat(`${data.coursePriceUSD_int || "0"}.${data.coursePriceUSD_cents || "00"}`)
          : undefined;

        if (combinedPrice !== courseData.price) {
          formData.append("price", combinedPrice.toString());
        }
        if (combinedPriceUSD !== undefined && combinedPriceUSD !== courseData.priceUSD) {
          formData.append("priceUSD", combinedPriceUSD.toString());
        }
        if ((currentValues.courseTags ?? []).toString() !== (courseData.tag ?? []).toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== courseData.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        // Enviar múltiples categorías si están presentes
        const categoryIds = [currentValues.courseCategory, currentValues.courseSector].filter(id =>
          id && id !== "" && !["undefined", "null", "NaN"].includes(String(id).trim())
        );

        categoryIds.forEach((id, index) => {
          const cleanId = String(id).trim();
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(cleanId)) {
            formData.append(`categories[${index}]`, cleanId);
          }
        });
        if (
          (currentValues.courseRequirements ?? []).toString() !==
          (courseData.instructions ?? []).toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements),
          );
        }
        if (
          currentValues.courseInstructor?.toString() !==
          ((courseData as any).instructors || []).toString()
        ) {
          formData.append(
            "instructors",
            JSON.stringify(data.courseInstructor),
          );
        }
        if (currentValues.courseImage !== courseData.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }
        if (currentValues.courseSyllabus !== ((courseData as any).syllabus || "")) {
          formData.append("syllabus", data.courseSyllabus as any);
        }
        if (currentValues.courseVideoUrl !== (courseData.promoVideoUrl || "")) {
          formData.append("promoVideoUrl", data.courseVideoUrl);
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
                const fullCourseDetails = await getFullDetailsOfCourse(
                  courseId,
                  token,
                );
                if (fullCourseDetails?.courseDetails) {
                  // Normalizar la estructura del curso
                  const normalizedCourse = normalizeCourseStructure(
                    fullCourseDetails.courseDetails,
                  );
                  dispatch(setCourse(normalizedCourse));
                } else {
                  // Si no se puede recargar, usar el resultado del edit
                  dispatch(setCourse(result));
                }
              } catch (refreshError) {
                console.error(
                  "Error refreshing course after edit:",
                  refreshError,
                );
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

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    const combinedPrice = parseFloat(`${data.coursePrice_int || "0"}.${data.coursePrice_cents || "00"}`);
    const combinedPriceUSD = (data.coursePriceUSD_int || data.coursePriceUSD_cents)
      ? parseFloat(`${data.coursePriceUSD_int || "0"}.${data.coursePriceUSD_cents || "00"}`)
      : undefined;

    formData.append("price", combinedPrice.toString());
    if (combinedPriceUSD !== undefined) {
      formData.append("priceUSD", combinedPriceUSD.toString());
    }
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);

    // Enviar múltiples categorías (Carrera y Sector)
    const categoryIds = [data.courseCategory, data.courseSector].filter(id =>
      id && id !== "" && !["undefined", "null", "NaN"].includes(String(id).trim())
    );

    categoryIds.forEach((id, index) => {
      const cleanId = String(id).trim();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(cleanId)) {
        formData.append(`categories[${index}]`, cleanId);
      }
    });
    // El campo status ya no es necesario - el backend siempre crea el curso como Draft
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("instructors", JSON.stringify(data.courseInstructor));
    formData.append("thumbnailImage", data.courseImage);
    if (data.courseSyllabus) {
      formData.append("syllabus", data.courseSyllabus as any);
    }
    if (data.courseVideoUrl) {
      formData.append("promoVideoUrl", data.courseVideoUrl);
    }

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

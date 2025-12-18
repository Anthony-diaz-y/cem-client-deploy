import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "@shared/services/courseDetailsAPI";
import { setCourse, setStep } from "@modules/course/store/courseSlice";
import { COURSE_STATUS } from "@shared/utils/constants";
import { RootState } from "@shared/store/store";
import { Course } from "../../course/types";
import { CourseInformationFormData } from "../types";

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
      setValue("courseTitle", courseData.courseName);
      setValue("courseShortDesc", courseData.courseDescription);
      setValue("coursePrice", courseData.price);
      setValue("courseTags", courseData.tag);
      setValue("courseBenefits", courseData.whatYouWillLearn);
      // courseCategory es un string (ID), obtener el ID del objeto category
      const categoryId = (courseData.category as any)?.id || courseData.category?._id || '';
      setValue("courseCategory", categoryId);
      setValue("courseRequirements", courseData.instructions);
      setValue("courseImage", courseData.thumbnail);
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
        const courseCategoryId = (courseData.category as any)?.id || courseData.category?._id;
        const newCategoryId = data.courseCategory; // Ya es un string
        
        if (currentValues.courseCategory !== courseCategoryId && newCategoryId) {
          // Validar formato UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(newCategoryId)) {
            formData.append("categoryId", newCategoryId); // Cambiado de "category" a "categoryId"
          } else {
            console.error("Invalid category ID format when editing course:", newCategoryId);
          }
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
            dispatch(setStep(2));
            dispatch(setCourse(result));
          }
        } catch (error) {
          console.error("Error updating course:", error);
          toast.error("Failed to update course");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("No changes made to the form");
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
    formData.append("status", COURSE_STATUS.DRAFT);
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

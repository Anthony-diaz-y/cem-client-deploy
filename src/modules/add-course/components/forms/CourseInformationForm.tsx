import { useSelector } from "react-redux";
import { FieldErrors } from "react-hook-form";
import CourseFormFields from "../form-fields/CourseFormFields";
import CourseFormActions from "../form-fields/CourseFormActions";
import { useCourseInformationForm } from "../../hooks/useCourseInformationForm";
import { RootState } from "@shared/store/store";
import { CourseInformationFormData } from "../../types";

// Formulario principal de información del curso
export default function CourseInformationForm() {
  const { course } = useSelector((state: RootState) => state.course);
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    loading,
    courseCategories,
    editCourse: isEditMode,
    onSubmit,
  } = useCourseInformationForm();

  const onError = (errors: FieldErrors<CourseInformationFormData>) => {
    // Get the first error field name
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      // Find element by id (most fields in CourseFormFields have id) 
      // or by name (which register sets)
      const errorElement = document.getElementById(firstErrorKey) ||
        document.getElementsByName(firstErrorKey)[0];

      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        // Optionally focus the element
        if ("focus" in errorElement) {
          (errorElement as HTMLElement).focus();
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="space-y-8 rounded-2xl border-[1px] border-cem-neutral-gray-200 bg-white p-8 shadow-sm">
        <CourseFormFields
          register={register}
          setValue={setValue}
          errors={errors}
          courseCategories={courseCategories}
          loading={loading}
          editCourse={isEditMode}
          course={course}
        />
      </div>

      <div className="flex justify-end pr-2">
        <CourseFormActions loading={loading} />
      </div>
    </form>
  );
}


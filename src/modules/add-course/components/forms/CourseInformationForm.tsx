import { useSelector } from "react-redux";
import CourseFormFields from "../form-fields/CourseFormFields";
import CourseFormActions from "../form-fields/CourseFormActions";
import { useCourseInformationForm } from "../../hooks/useCourseInformationForm";
import { RootState } from "@shared/store/store";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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


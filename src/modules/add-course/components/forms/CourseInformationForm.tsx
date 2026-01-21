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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <CourseFormFields
        register={register}
        setValue={setValue}
        errors={errors}
        courseCategories={courseCategories}
        loading={loading}
        editCourse={isEditMode}
        course={course}
      />

      <CourseFormActions loading={loading} />
    </form>
  );
}


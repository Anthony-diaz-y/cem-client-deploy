import { useSelector } from "react-redux";
import NestedView from "./NestedView";
import SectionForm from "./SectionForm";
import CourseBuilderNavigation from "./CourseBuilderNavigation";
import { useSectionForm } from "../hooks/useSectionForm";
import { useCourseBuilderNavigation } from "../hooks/useCourseBuilderNavigation";
import { RootState } from "@shared/store/store";
import { Course } from "../../course/types";

/**
 * CourseBuilderForm - Main component for course builder form
 * Orchestrates form and navigation logic through custom hooks
 */
export default function CourseBuilderForm() {
  const { course } = useSelector((state: RootState) => state.course);
  const {
    register,
    handleSubmit,
    errors,
    loading,
    editSectionName,
    onSubmit,
    cancelEdit,
    handleChangeEditSectionName,
  } = useSectionForm();
  const { goToNext, goBack } = useCourseBuilderNavigation();

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <SectionForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        loading={loading}
        editSectionName={editSectionName}
        onSubmit={onSubmit}
        onCancelEdit={cancelEdit}
      />

      {course && 
       (course as Course).courseContent && 
       Array.isArray((course as Course).courseContent) && 
       (course as Course).courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <CourseBuilderNavigation
        loading={loading}
        onNext={goToNext}
        onBack={goBack}
      />
    </div>
  );
}

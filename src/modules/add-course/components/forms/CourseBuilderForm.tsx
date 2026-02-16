import { useSelector } from "react-redux";
import NestedView from "../views/NestedView";
import SectionForm from "./SectionForm";
import CourseBuilderNavigation from "../navigation/CourseBuilderNavigation";
import { useSectionForm } from "../../hooks/useSectionForm";
import { useCourseBuilderNavigation } from "../../hooks/useCourseBuilderNavigation";
import { RootState } from "@shared/store/store";
import { Course } from "../../../course/types";

// Formulario principal del constructor de cursos
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
    <>
      <div className="space-y-8 rounded-2xl border-[1px] border-cem-neutral-gray-100 bg-white p-8 shadow-sm">
        <p className="text-2xl font-semibold text-cem-neutral-gray-900 font-boogaloo">Constructor del curso</p>

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
      </div>

      <div className="mt-8">
        <CourseBuilderNavigation
          loading={loading}
          onNext={goToNext}
          onBack={goBack}
        />
      </div>
    </>
  );
}


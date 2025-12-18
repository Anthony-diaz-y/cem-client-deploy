import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setStep, setEditCourse } from "../../course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { Course } from "../../course/types";

/**
 * Custom hook for course builder navigation logic
 * Separates navigation logic from component
 */
export const useCourseBuilderNavigation = () => {
  const dispatch = useDispatch();
  const { course } = useSelector((state: RootState) => state.course);

  const goToNext = () => {
    if (!course) return;

    const courseData = course as Course;
    
    // Validar que courseContent existe y es un array
    if (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }
    
    // Validar que cada sección tenga al menos una subsección
    const sectionsWithoutLectures = courseData.courseContent.filter(
      (section) => {
        // Verificar que subSection existe, es un array y tiene al menos un elemento
        const hasSubSections = section.subSection && 
                              Array.isArray(section.subSection) && 
                              section.subSection.length > 0;
        if (!hasSubSections) {
          console.log(`Section "${section.sectionName}" (ID: ${(section as any)?.id || section?._id}) has no lectures`);
        }
        return !hasSubSections;
      }
    );
    
    if (sectionsWithoutLectures.length > 0) {
      console.log("Sections without lectures:", sectionsWithoutLectures);
      toast.error(`Please add atleast one lecture in each section. ${sectionsWithoutLectures.length} section(s) without lectures.`);
      return;
    }

    dispatch(setStep(3));
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return { goToNext, goBack };
};

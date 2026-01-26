import { useDispatch, useSelector } from "react-redux";
import { deleteSection, deleteSubSection } from "@shared/services/courseDetailsAPI";
import { setCourse } from "@modules/course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { Course, Section, SubSection } from "@modules/course/types";
import { normalizeCourseStructure } from "../utils/normalizeCourseStructure";

// Hook para manejar acciones de eliminación
export function useNestedViewActions() {
  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleDeleteSection = async (sectionId: string) => {
    if (!course || !token) return;  
    const courseData = course as Course;
    const courseId = (courseData as { id?: string })?.id || courseData?._id;
    
    if (!courseId) {
      return;
    }
    
    const result = await deleteSection(
      { sectionId, courseId: courseId },
      token
    );
    if (result) {
      const normalizedResult = normalizeCourseStructure(result as Course);
      dispatch(setCourse(normalizedResult));
    }
    return result;
  };

  const handleDeleteSubSection = async (
    subSectionId: string,
    sectionId: string
  ) => {
    if (!course || !token) return;
    const courseData = course as Course;
    const result = await deleteSubSection({ subSectionId, sectionId }, token);
    if (result && courseData) {
      const updatedCourseContent = courseData.courseContent.map(
        (section: Section) => {
          const currentSectionId = (section as { id?: string })?.id || section?._id;
          if (currentSectionId === sectionId) {
            const resultAny = result as { subSections?: SubSection[]; subSection?: SubSection[] };
            const normalizedSection = {
              ...section,
              ...result,
              subSection: resultAny.subSections || resultAny.subSection || [],
            };
            return normalizedSection;
          }
          return section;
        }
      );
      const updatedCourse: Course = {
        ...courseData,
        courseContent: updatedCourseContent,
      };
      dispatch(setCourse(updatedCourse));
    }
    return result;
  };

  return {
    handleDeleteSection,
    handleDeleteSubSection,
  };
}



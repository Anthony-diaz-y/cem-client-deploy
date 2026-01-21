import { Course, Section, SubSection } from "@modules/course/types";

// Normalizar estructura del curso (subSections -> subSection)
export const normalizeCourseStructure = (course: Course): Course => {
  if (!course || !course.courseContent) return course;
  
  const normalizedContent = course.courseContent.map((section: Section) => {
    const sectionAny = section as { subSections?: SubSection[] };
    if (sectionAny.subSections && Array.isArray(sectionAny.subSections)) {
      return {
        ...section,
        subSection: sectionAny.subSections,
      };
    }
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



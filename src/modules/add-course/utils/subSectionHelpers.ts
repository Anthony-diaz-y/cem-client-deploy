import { Course, Section, SubSection } from "../../course/types";

// Obtener ID de sección (soporta id o _id)
export const getSectionId = (section: Section): string | null => {
  return (section as { id?: string })?.id || section?._id || null;
};

// Obtener ID de subsección (soporta id o _id)
export const getSubSectionId = (subSection: SubSection): string | null => {
  return (subSection as { id?: string })?.id || subSection?._id || null;
};

// Extraer array de subsecciones de diferentes formatos de respuesta
export const extractSubSectionsArray = (result: unknown, section: Section): SubSection[] => {
  const resultAny = result as { subSections?: SubSection[]; subSection?: SubSection[] };
  
  if (resultAny.subSections && Array.isArray(resultAny.subSections)) {
    return resultAny.subSections;
  }
  if (resultAny.subSection && Array.isArray(resultAny.subSection)) {
    return resultAny.subSection;
  }
  if (section.subSection && Array.isArray(section.subSection)) {
    return section.subSection;
  }
  const sectionAny = section as { subSections?: SubSection[] };
  if (sectionAny.subSections && Array.isArray(sectionAny.subSections)) {
    return sectionAny.subSections;
  }
  return [];
};

// Preservar orden de subsecciones al actualizar
export const preserveSubSectionOrder = (
  originalSubSections: SubSection[],
  updatedSubSections: SubSection[]
): SubSection[] => {
  const originalIds = originalSubSections.map((sub) => getSubSectionId(sub)?.toString()).filter(Boolean) as string[];
  
  const updatedMap = new Map<string, SubSection>();
  updatedSubSections.forEach((sub) => {
    const id = getSubSectionId(sub)?.toString();
    if (id) updatedMap.set(id, sub);
  });

  const preservedOrder: SubSection[] = [];
  
  originalIds.forEach((originalId) => {
    const updatedSub = updatedMap.get(originalId);
    if (updatedSub) {
      preservedOrder.push(updatedSub);
      updatedMap.delete(originalId);
    } else {
      const originalSub = originalSubSections.find(
        (sub) => getSubSectionId(sub)?.toString() === originalId
      );
      if (originalSub) preservedOrder.push(originalSub);
    }
  });

  updatedMap.forEach((sub) => {
    preservedOrder.push(sub);
  });

  return preservedOrder;
};

export const updateCourseWithSubSections = (
  courseData: Course,
  sectionId: string,
  result: unknown
): Course => {
  const updatedCourseContent = courseData.courseContent.map((section: Section) => {
    const currentSectionId = getSectionId(section);
    
    if (currentSectionId === sectionId) {
      const subSectionArray = extractSubSectionsArray(result, section);
      const originalSubSections = section.subSection || [];
      const orderedSubSections = preserveSubSectionOrder(originalSubSections, subSectionArray);

      const resultObj = result && typeof result === 'object' ? result as Record<string, unknown> : {};
      
      return {
        ...section,
        ...resultObj,
        subSection: orderedSubSections,
      };
    }
    return section;
  });

  return {
    ...courseData,
    courseContent: updatedCourseContent,
  };
};


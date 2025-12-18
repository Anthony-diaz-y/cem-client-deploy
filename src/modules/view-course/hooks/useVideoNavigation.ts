import { useRouter, useParams } from "next/navigation";
import { Section, SubSection } from "../types";

/**
 * Custom hook for video navigation logic
 * Separates navigation logic from component
 */
export const useVideoNavigation = (courseSectionData: Section[]) => {
  const router = useRouter();
  const params = useParams();
  
  // Normalizar parámetros para manejar arrays
  const courseId = Array.isArray(params?.courseId) ? params.courseId[0] : params?.courseId;
  const sectionId = Array.isArray(params?.sectionId) ? params.sectionId[0] : params?.sectionId;
  const subSectionId = Array.isArray(params?.subSectionId) ? params.subSectionId[0] : params?.subSectionId;

  const isFirstVideo = (): boolean => {
    if (!sectionId || !subSectionId || !courseSectionData.length) return false;
    
    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => (data._id || (data as any)?.id) === sectionId
    );

    if (currentSectionIndx === -1) return false;

    const subSections = courseSectionData[currentSectionIndx]?.subSection || 
                       (courseSectionData[currentSectionIndx] as any)?.subSections || [];
    
    const currentSubSectionIndx = subSections.findIndex(
      (data: SubSection) => (data._id || (data as any)?.id) === subSectionId
    );

    return currentSectionIndx === 0 && currentSubSectionIndx === 0;
  };

  const isLastVideo = (): boolean => {
    if (!sectionId || !subSectionId || !courseSectionData.length) return false;
    
    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => (data._id || (data as any)?.id) === sectionId
    );

    if (currentSectionIndx === -1) return false;

    const subSections = courseSectionData[currentSectionIndx]?.subSection || 
                       (courseSectionData[currentSectionIndx] as any)?.subSections || [];
    const noOfSubsections = subSections.length || 0;

    const currentSubSectionIndx = subSections.findIndex(
      (data: SubSection) => (data._id || (data as any)?.id) === subSectionId
    );

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    );
  };

  const getNextVideoInfo = (): { 
    nextSectionName?: string; 
    nextLectureTitle?: string; 
    isNextSection: boolean;
  } | null => {
    if (!sectionId || !subSectionId || !courseSectionData.length) return null;

    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => (data._id || (data as any)?.id) === sectionId
    );

    if (currentSectionIndx === -1) return null;

    const currentSection = courseSectionData[currentSectionIndx];
    const subSections = currentSection?.subSection || (currentSection as any)?.subSections || [];
    const currentSubSectionIndx = subSections.findIndex(
      (data: SubSection) => (data._id || (data as any)?.id) === subSectionId
    );

    // Si hay más lectures en la sección actual
    if (currentSubSectionIndx !== subSections.length - 1) {
      const nextLecture = subSections[currentSubSectionIndx + 1];
      return {
        nextLectureTitle: nextLecture?.title,
        isNextSection: false,
      };
    }
    
    // Si se terminó la sección actual, buscar la siguiente sección
    if (courseSectionData[currentSectionIndx + 1]) {
      const nextSection = courseSectionData[currentSectionIndx + 1];
      const nextSectionSubSections = nextSection?.subSection || (nextSection as any)?.subSections || [];
      const nextLecture = nextSectionSubSections[0];
      
      return {
        nextSectionName: nextSection?.sectionName || (nextSection as any)?.sectionName,
        nextLectureTitle: nextLecture?.title,
        isNextSection: true,
      };
    }

    return null;
  };

  const goToNextVideo = () => {
    if (!sectionId || !subSectionId || !courseId || !courseSectionData.length) return;

    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => (data._id || (data as any)?.id) === sectionId
    );

    if (currentSectionIndx === -1) return;

    const currentSection = courseSectionData[currentSectionIndx];
    const subSections = currentSection?.subSection || (currentSection as any)?.subSections || [];
    const currentSubSectionIndx = subSections.findIndex(
      (data: SubSection) => (data._id || (data as any)?.id) === subSectionId
    );

    // Si hay más lectures en la sección actual
    if (currentSubSectionIndx !== subSections.length - 1) {
      const nextLecture = subSections[currentSubSectionIndx + 1];
      const nextSubSectionId = nextLecture?._id || (nextLecture as any)?.id;
      
      if (nextSubSectionId) {
        router.push(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
        );
      }
    } 
    // Si se terminó la sección actual, ir a la siguiente sección
    else if (courseSectionData[currentSectionIndx + 1]) {
      const nextSection = courseSectionData[currentSectionIndx + 1];
      const nextSectionId = nextSection._id || (nextSection as any)?.id;
      const nextSectionSubSections = nextSection?.subSection || (nextSection as any)?.subSections || [];
      const nextLecture = nextSectionSubSections[0];
      const nextSubSectionId = nextLecture?._id || (nextLecture as any)?.id;
      
      if (nextSectionId && nextSubSectionId) {
        router.push(
          `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
        );
      }
    }
  };

  const goToPrevVideo = () => {
    if (!sectionId || !subSectionId || !courseId || !courseSectionData.length) return;

    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => (data._id || (data as any)?.id) === sectionId
    );

    if (currentSectionIndx === -1) return;

    const currentSection = courseSectionData[currentSectionIndx];
    const subSections = currentSection?.subSection || (currentSection as any)?.subSections || [];
    const currentSubSectionIndx = subSections.findIndex(
      (data: SubSection) => (data._id || (data as any)?.id) === subSectionId
    );

    // Si no es la primera lecture de la sección actual
    if (currentSubSectionIndx > 0) {
      const prevLecture = subSections[currentSubSectionIndx - 1];
      const prevSubSectionId = prevLecture?._id || (prevLecture as any)?.id;
      
      if (prevSubSectionId) {
        router.push(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
        );
      }
    } 
    // Si es la primera lecture, ir a la última lecture de la sección anterior
    else if (courseSectionData[currentSectionIndx - 1]) {
      const prevSection = courseSectionData[currentSectionIndx - 1];
      const prevSectionId = prevSection._id || (prevSection as any)?.id;
      const prevSectionSubSections = prevSection?.subSection || (prevSection as any)?.subSections || [];
      const prevLecture = prevSectionSubSections[prevSectionSubSections.length - 1];
      const prevSubSectionId = prevLecture?._id || (prevLecture as any)?.id;
      
      if (prevSectionId && prevSubSectionId) {
        router.push(
          `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
        );
      }
    }
  };

  return {
    isFirstVideo,
    isLastVideo,
    goToNextVideo,
    goToPrevVideo,
    getNextVideoInfo,
  };
};

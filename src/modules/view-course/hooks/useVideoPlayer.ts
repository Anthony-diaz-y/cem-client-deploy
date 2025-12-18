import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { markLectureAsComplete } from "@shared/services/courseDetailsAPI";
import { updateCompletedLectures } from "../store/viewCourseSlice";
import { RootState, AppDispatch } from "@shared/store/store";
import { Section, SubSection } from "../types";

/**
 * Custom hook for video player logic
 * Separates video player state and logic from component
 */
export const useVideoPlayer = (
  courseSectionData: Section[],
  courseEntireData: { thumbnail: string } | null
) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  
  // Normalizar parámetros para manejar arrays
  const courseId = Array.isArray(params?.courseId) ? params.courseId[0] : params?.courseId;
  const sectionId = Array.isArray(params?.sectionId) ? params.sectionId[0] : params?.sectionId;
  const subSectionId = Array.isArray(params?.subSectionId) ? params.subSectionId[0] : params?.subSectionId;
  const { token } = useSelector((state: RootState) => state.auth);
  const { completedLectures } = useSelector(
    (state: RootState) => state.viewCourse
  );

  const playerRef = useRef<{ seek: (time: number) => void } | null>(null);
  const [videoData, setVideoData] = useState<SubSection | null>(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!courseSectionData.length) {
        console.log("No course section data available");
        return;
      }
      
      if (!courseId || !sectionId || !subSectionId) {
        console.log("Missing required IDs:", { 
          courseId, 
          sectionId, 
          subSectionId 
        });
        return;
      }

      // Buscar la sección - manejar tanto _id como id, normalizando ambos para comparación
      const normalizedSectionId = sectionId?.toString().trim();
      const filteredData = courseSectionData.filter((course: Section) => {
        const courseSectionId = (course._id || (course as any)?.id)?.toString().trim();
        return courseSectionId === normalizedSectionId;
      });

      if (!filteredData || filteredData.length === 0) {
        console.error("Section not found:", sectionId, "Available sections:", courseSectionData.map((s: Section) => s._id || (s as any)?.id));
        
        // Si no se encuentra la sección, intentar redirigir a la primera sección disponible
        if (courseSectionData.length > 0) {
          const firstSection = courseSectionData[0];
          const firstSectionId = (firstSection._id || (firstSection as any)?.id)?.toString();
          const firstSubSections = firstSection.subSection || (firstSection as any)?.subSections || [];
          
          if (firstSubSections.length > 0) {
            const firstSubSection = firstSubSections[0];
            const firstSubSectionId = (firstSubSection._id || (firstSubSection as any)?.id)?.toString();
            
            console.log("Redirecting to first available section:", {
              sectionId: firstSectionId,
              subSectionId: firstSubSectionId
            });
            
            router.push(
              `/view-course/${courseId}/section/${firstSectionId}/sub-section/${firstSubSectionId}`
            );
            return;
          }
        }
        
        return;
      }

      const section = filteredData[0];
      
      // Manejar tanto subSection como subSections (del backend)
      const subSections = section.subSection || (section as any)?.subSections || [];
      
      if (!Array.isArray(subSections) || subSections.length === 0) {
        console.error("No subSections found in section:", section);
        return;
      }

      // Buscar la subsección - manejar tanto _id como id, normalizando ambos para comparación
      const normalizedSubSectionId = subSectionId?.toString().trim();
      const filteredVideoData = subSections.filter((data: SubSection) => {
        const dataSubSectionId = (data._id || (data as any)?.id)?.toString().trim();
        return dataSubSectionId === normalizedSubSectionId;
      });

      if (!filteredVideoData || filteredVideoData.length === 0) {
        console.error("SubSection not found:", subSectionId, "Available subSections:", subSections.map((s: SubSection) => s._id || (s as any)?.id));
        
        // Si no se encuentra la subsección, intentar redirigir a la primera subsección de la sección actual
        if (subSections.length > 0) {
          const firstSubSection = subSections[0];
          const firstSubSectionId = (firstSubSection._id || (firstSubSection as any)?.id)?.toString();
          const currentSectionId = (section._id || (section as any)?.id)?.toString();
          
          console.log("Redirecting to first available subSection in current section:", {
            sectionId: currentSectionId,
            subSectionId: firstSubSectionId
          });
          
          router.push(
            `/view-course/${courseId}/section/${currentSectionId}/sub-section/${firstSubSectionId}`
          );
          return;
        }
        
        return;
      }

      const video = filteredVideoData[0];
      
      console.log("Video data found:", {
        title: video.title,
        videoUrl: video.videoUrl,
        hasVideoUrl: !!video.videoUrl,
      });

      if (video) {
        setVideoData(video);
      }
      
      if (courseEntireData) {
        setPreviewSource(courseEntireData.thumbnail);
      }
      
      setVideoEnded(false);
    })();
  }, [
    courseSectionData,
    courseEntireData,
    pathname,
    courseId,
    sectionId,
    subSectionId,
    router,
  ]);

  const handleLectureCompletion = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await markLectureAsComplete(
        { courseId: courseId, subsectionId: subSectionId },
        token
      );
      if (res) {
        dispatch(updateCompletedLectures(subSectionId));
      }
    } catch (error) {
      console.error("Error marking lecture as complete:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRewatch = () => {
    if (playerRef?.current) {
      playerRef.current.seek(0);
      setVideoEnded(false);
    }
  };

  return {
    playerRef,
    videoData,
    previewSource,
    videoEnded,
    loading,
    setVideoEnded,
    handleLectureCompletion,
    handleRewatch,
    isCompleted: completedLectures.includes(subSectionId),
  };
};

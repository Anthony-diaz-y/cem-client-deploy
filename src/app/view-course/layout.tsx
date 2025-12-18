"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";

import VideoDetailsReviewModal from "@modules/view-course/components/VideoDetailsReviewModal";
import VideoDetailsSidebar from "@modules/view-course/components/VideoDetailsSidebar";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "@modules/view-course/store/viewCourseSlice";
import { setCourseViewSidebar } from "@modules/dashboard/store/sidebarSlice";
import { getFullDetailsOfCourse } from "@shared/services/courseDetailsAPI";

export default function ViewCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [reviewModal, setReviewModal] = useState(false);

  // get Full Details Of Course
  useEffect(() => {
    (async () => {
      // Normalize courseId to string
      const courseIdString = Array.isArray(courseId)
        ? courseId[0]
        : courseId;

      if (!courseIdString || !token) {
        console.error("Course ID and token are required");
        return;
      }

      try {
        // Fetch full course details from backend
        const courseData = await getFullDetailsOfCourse(courseIdString, token);

        if (courseData?.courseDetails) {
          console.log("Raw course data from backend:", {
            courseName: courseData.courseDetails.courseName,
            courseContentLength: courseData.courseDetails.courseContent?.length,
            firstSection: courseData.courseDetails.courseContent?.[0],
          });

          // Normalizar la estructura del curso (subSections -> subSection) y normalizar IDs
          // Ordenar secciones por fecha de creación (más antiguas primero)
          const rawContent = courseData.courseDetails.courseContent || [];
          const sortedContent = [...rawContent].sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB; // Orden ascendente (más antiguas primero)
          });
          
          const normalizedContent = sortedContent.map((section: any) => {
            // Normalizar el ID de la sección
            const normalizedSectionId = (section._id || section.id)?.toString().trim();
            
            // Normalizar subsecciones
            let normalizedSubSections = section.subSection || section.subSections || [];
            
            // Si tiene subSections (con S mayúscula), convertir a subSection
            if (section.subSections && Array.isArray(section.subSections)) {
              normalizedSubSections = section.subSections;
            }
            
            // Normalizar IDs de subsecciones
            const normalizedSubSectionsWithIds = normalizedSubSections.map((subSection: any) => {
              const normalizedSubSectionId = (subSection._id || subSection.id)?.toString().trim();
              return {
                ...subSection,
                _id: normalizedSubSectionId,
                id: normalizedSubSectionId,
              };
            });

            // Log para depuración
            if (process.env.NODE_ENV === 'development') {
              console.log("Processing section:", {
                sectionName: section.sectionName,
                sectionId: normalizedSectionId,
                subSectionCount: normalizedSubSectionsWithIds.length,
                subSectionIds: normalizedSubSectionsWithIds.map((s: any) => s._id || s.id),
              });
            }

            return {
              ...section,
              _id: normalizedSectionId,
              id: normalizedSectionId,
              subSection: normalizedSubSectionsWithIds.sort((a: any, b: any) => {
                // Ordenar subsecciones también por fecha de creación
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateA - dateB; // Orden ascendente (más antiguas primero)
              }),
            };
          });

          // Log de las subsecciones normalizadas
          if (process.env.NODE_ENV === 'development') {
            normalizedContent.forEach((sec: any, idx: number) => {
              console.log(`Section ${idx} (${sec.sectionName}):`, {
                subSectionCount: sec.subSection?.length,
                subSections: sec.subSection?.map((sub: any) => ({
                  title: sub.title,
                  videoUrl: sub.videoUrl,
                  hasVideoUrl: !!sub.videoUrl,
                })),
              });
            });
          }

          dispatch(setCourseSectionData(normalizedContent));
          dispatch(setEntireCourseData({
            ...courseData.courseDetails,
            courseContent: normalizedContent,
          }));
          dispatch(setCompletedLectures(courseData.completedVideos || []));
          
          // Contar las lectures correctamente
          let lectures = 0;
          normalizedContent.forEach((sec: any) => {
            const subSections = sec.subSection || sec.subSections || [];
            lectures += Array.isArray(subSections) ? subSections.length : 0;
          });
          dispatch(setTotalNoOfLectures(lectures));
          
          console.log("Course data loaded:", {
            sections: normalizedContent.length,
            lectures,
            courseName: courseData.courseDetails.courseName,
          });
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    })();
  }, [courseId, token, dispatch]);

  // handle sidebar for small devices
  const { courseViewSidebar } = useAppSelector((state) => state.sidebar);
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);

  // set curr screen Size
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScreenSize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleScreenSize);
    handleScreenSize();
    return () => window.removeEventListener("resize", handleScreenSize);
  }, []);

  // close / open sidebar according screen size
  useEffect(() => {
    if (screenSize && screenSize <= 640) {
      dispatch(setCourseViewSidebar(false));
    } else dispatch(setCourseViewSidebar(true));
  }, [screenSize, dispatch]);

  return (
    <>
      <div className="relative flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* view course side bar */}
        {courseViewSidebar && (
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        )}

        <div className="h-full flex-1 overflow-y-auto mt-14">
          <div className="mx-6 py-6">{children}</div>
        </div>
      </div>

      {reviewModal && (
        <VideoDetailsReviewModal setReviewModal={setReviewModal} />
      )}
    </>
  );
}

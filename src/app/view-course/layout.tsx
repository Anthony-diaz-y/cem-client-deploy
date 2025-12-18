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
          dispatch(setCourseSectionData(courseData.courseDetails.courseContent || []));
          dispatch(setEntireCourseData(courseData.courseDetails));
          dispatch(setCompletedLectures(courseData.completedVideos || []));
          
          let lectures = 0;
          courseData?.courseDetails?.courseContent?.forEach((sec: any) => {
            lectures += sec.subSection?.length || 0;
          });
          dispatch(setTotalNoOfLectures(lectures));
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
      <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
        {/* view course side bar */}
        {courseViewSidebar && (
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        )}

        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto mt-14">
          <div className="mx-6">{children}</div>
        </div>
      </div>

      {reviewModal && (
        <VideoDetailsReviewModal setReviewModal={setReviewModal} />
      )}
    </>
  );
}

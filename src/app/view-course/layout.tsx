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

export default function ViewCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [reviewModal, setReviewModal] = useState(false);

  // get Full Details Of Course
  useEffect(() => {
    (async () => {
      // Normalize courseId to string
      const courseIdString = Array.isArray(courseId)
        ? courseId[0]
        : courseId || "mock_course_1";

      // Mock Data for Video Demo
      const mockCourseData = {
        completedVideos: ["sub1", "sub2", "sub3"],
        courseDetails: {
          _id: courseIdString,
          courseName: "MERN Stack Bootcamp 2024",
          courseDescription:
            "Master the MERN stack with this comprehensive bootcamp covering MongoDB, Express, React, and Node.js.",
          instructor: {
            _id: "instructor_1",
            firstName: "John",
            lastName: "Doe",
          },
          thumbnail:
            "https://res.cloudinary.com/ddxe5fa6y/image/upload/v1709405230/thumbnails/webdev_thumb.jpg",
          price: 4999,
          courseContent: [
            {
              _id: "sec1",
              sectionName: "Introduction",
              subSection: [
                {
                  _id: "sub1",
                  title: "Welcome to the Course",
                  description: "Introduction to what you will learn.",
                  videoUrl:
                    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  timeDuration: "10:34",
                },
                {
                  _id: "sub2",
                  title: "Course Structure",
                  description: "How the course is organized.",
                  videoUrl:
                    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                  timeDuration: "10:53",
                },
              ],
            },
            {
              _id: "sec2",
              sectionName: "React Basics",
              subSection: [
                {
                  _id: "sub3",
                  title: "Hello World in React",
                  description: "Your first React component.",
                  videoUrl:
                    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                  timeDuration: "05:20",
                },
              ],
            },
          ],
        },
      };

      // const courseData = await getFullDetailsOfCourse(courseId, token)
      const courseData = mockCourseData;

      // console.log("Course Data here... ", courseData.courseDetails)
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    })();
  }, [courseId, dispatch]);

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

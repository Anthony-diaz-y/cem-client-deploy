"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HiBookOpen } from "react-icons/hi2";
import { ProgressBar, Img } from "@shared/components";
import { Course, Section } from "../types";
import { RootState } from "@shared/store/store";
import { getUserEnrolledCourses } from "@shared/services/profileAPI";
import { getFullDetailsOfCourse } from "@shared/services/courseDetailsAPI";
import { formatTotalDuration } from "@shared/utils/durationHelper";

interface CourseWithId extends Course {
  id?: string;
}

interface SectionWithId extends Section {
  id?: string;
  subSections?: Section['subSection'];
}

interface SubSectionWithId {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

const CourseThumbnailSmall: React.FC<{ thumbnail?: string; courseName?: string }> = ({ thumbnail, courseName }) => {
  if (!thumbnail) {
    return (
      <div className="h-14 w-14 rounded-lg overflow-hidden bg-richblack-900 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-richblack-800 to-richblack-900 text-richblack-400">
        <HiBookOpen size={20} className="opacity-60" />
      </div>
    );
  }

  return (
    <div className="h-14 w-14 rounded-lg overflow-hidden bg-richblack-900 relative flex-shrink-0">
      <Img
        src={thumbnail}
        alt={courseName || "course_img"}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

const getCourseId = (course: CourseWithId): string | undefined => {
  return course.id || course._id;
};

const getSectionId = (section: SectionWithId): string | undefined => {
  return section.id || section._id;
};

const getSubSectionId = (subSection: SubSectionWithId): string | undefined => {
  return subSection.id || subSection._id;
};

const getSubSections = (section: SectionWithId): SubSectionWithId[] => {
  if (Array.isArray(section.subSections)) {
    return section.subSections;
  }
  if (Array.isArray(section.subSection)) {
    return section.subSection as SubSectionWithId[];
  }
  return [];
};

export default function EnrolledCourses() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const getEnrolledCourses = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getUserEnrolledCourses(token);
      
      if (res && Array.isArray(res)) {
        setEnrolledCourses(res as Course[]);
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error("Could not fetch enrolled courses.", error);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getEnrolledCourses();
  }, [getEnrolledCourses, refreshKey]);

  // Recargar cursos cuando la página recibe foco (útil después de comprar)
  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        // Solo recargar si la página ha estado oculta por un tiempo
        setRefreshKey(prev => prev + 1);
      }
    };

    // Escuchar evento personalizado para recargar cursos después de compra
    const handleCoursePurchased = () => {
      console.log("Evento de compra detectado, recargando cursos...");
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('coursePurchased', handleCoursePurchased as EventListener);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('coursePurchased', handleCoursePurchased as EventListener);
    };
  }, [token]);

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className="h-14 w-14 rounded-lg skeleton "></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    );
  };

  // return if data is null
  if (enrolledCourses?.length == 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        You have not enrolled in any course yet.
      </p>
    );
  }

  return (
    <>
      <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">
        Enrolled Courses
      </div>
      {
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-2xl bg-richblack-800 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* loading Skeleton */}
          {loading && (
            <div>
              {sklItem()}
              {sklItem()}
              {sklItem()}
              {sklItem()}
              {sklItem()}
            </div>
          )}

          {/* Course Names */}
          {enrolledCourses?.map((course: Course, i: number, arr: Course[]) => (
            <div
              className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3 hover:bg-richblack-700 transition-colors rounded"
                onClick={async () => {
                  const courseWithId = course as CourseWithId;
                  const courseId = getCourseId(courseWithId);
                  
                  if (!courseId) {
                    console.error("Missing course ID:", course);
                    return;
                  }

                  const firstSection = course.courseContent?.[0] as SectionWithId | undefined;
                  const sectionId = firstSection ? getSectionId(firstSection) : undefined;
                  
                  const subSections = firstSection ? getSubSections(firstSection) : [];
                  const firstSubSection = subSections.length > 0 ? subSections[0] : null;
                  const subSectionId = firstSubSection ? getSubSectionId(firstSubSection) : undefined;

                  if (courseId && sectionId && subSectionId) {
                    router.push(
                      `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`
                    );
                  } else {
                    if (!token) {
                      console.error("Token is required to load course details");
                      return;
                    }
                    
                    try {
                      const courseData = await getFullDetailsOfCourse(courseId, token);
                      
                      if (courseData?.courseDetails?.courseContent) {
                        const courseContent = courseData.courseDetails.courseContent as SectionWithId[];
                        const firstSec = courseContent[0];
                        const secId = firstSec ? getSectionId(firstSec) : undefined;
                        
                        const subs = firstSec ? getSubSections(firstSec) : [];
                        const firstSub = subs.length > 0 ? subs[0] : null;
                        const subSecId = firstSub ? getSubSectionId(firstSub) : undefined;
                        
                        if (secId && subSecId) {
                          router.push(
                            `/view-course/${courseId}/section/${secId}/sub-section/${subSecId}`
                          );
                        } else {
                          router.push(`/view-course/${courseId}`);
                        }
                      } else {
                        router.push(`/view-course/${courseId}`);
                      }
                    } catch (error) {
                      console.error("Error loading course details:", error);
                      router.push(`/view-course/${courseId}`);
                    }
                  }
                }}
              >
                {/* Imagen del curso - tamaño fijo y consistente */}
                <CourseThumbnailSmall thumbnail={course.thumbnail} courseName={course.courseName} />

                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              <div className="sm:hidden">
                <div className="px-2 py-3">{formatTotalDuration(course?.totalDuration)}</div>

                <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                  <p>Progress: {course.progressPercentage || 0}%</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>

              {/* only for larger devices */}
              {/* duration -  progress */}
              <div className="hidden w-1/5 sm:flex px-2 py-3">
                {formatTotalDuration(course?.totalDuration)}
              </div>
              <div className="hidden sm:flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      }
    </>
  );
}

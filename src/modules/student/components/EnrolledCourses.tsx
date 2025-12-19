"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HiBookOpen } from "react-icons/hi2";
import ProgressBar from "@shared/components/ProgressBar";
import { Course } from "../types";
import { RootState } from "@shared/store/store";
import { getUserEnrolledCourses } from "@shared/services/profileAPI";
import { getFullDetailsOfCourse } from "@shared/services/courseDetailsAPI";
import { formatTotalDuration } from "@shared/utils/durationHelper";

// Componente para la imagen pequeña del curso con placeholder
const CourseThumbnailSmall: React.FC<{ thumbnail?: string; courseName?: string }> = ({ thumbnail, courseName }) => {
  const [imageError, setImageError] = useState(!thumbnail);

  if (!thumbnail || imageError) {
    return (
      <div className="h-14 w-14 rounded-lg overflow-hidden bg-richblack-900 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-richblack-800 to-richblack-900 text-richblack-400">
        <HiBookOpen size={20} className="opacity-60" />
      </div>
    );
  }

  return (
    <div className="h-14 w-14 rounded-lg overflow-hidden bg-richblack-900 relative flex-shrink-0">
      <img
        src={thumbnail}
        alt={courseName || "course_img"}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default function EnrolledCourses() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para obtener cursos inscritos
  const getEnrolledCourses = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getUserEnrolledCourses(token);
      
      console.log("Enrolled courses response:", res);
      console.log("Number of courses:", res?.length);
      
      if (res && Array.isArray(res)) {
        setEnrolledCourses(res);
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error("Could not fetch enrolled courses.", error);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [token, refreshKey]);

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
          {enrolledCourses?.map((course, i, arr) => (
            <div
              className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3 hover:bg-richblack-700 transition-colors rounded"
                onClick={async () => {
                  // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
                  const courseId = (course as any)?.id || course?._id;
                  
                  if (!courseId) {
                    console.error("Missing course ID:", course);
                    return;
                  }

                  // Intentar obtener la primera sección y subsección de los datos disponibles
                  const firstSection = course.courseContent?.[0];
                  const sectionId = firstSection?._id || (firstSection as any)?.id;
                  
                  // Manejar tanto subSection como subSections (del backend)
                  const subSections = firstSection?.subSection || (firstSection as any)?.subSections;
                  const firstSubSection = Array.isArray(subSections) && subSections.length > 0 ? subSections[0] : null;
                  const subSectionId = firstSubSection?._id || (firstSubSection as any)?.id;

                  // Si tenemos todos los IDs, navegar directamente al video
                  if (courseId && sectionId && subSectionId) {
                    router.push(
                      `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`
                    );
                  } else {
                    // Si no tenemos los IDs completos, cargar los datos del curso primero
                    // y luego navegar a la primera lección
                    if (!token) {
                      console.error("Token is required to load course details");
                      return;
                    }
                    
                    try {
                      const courseData = await getFullDetailsOfCourse(courseId, token);
                      
                      if (courseData?.courseDetails?.courseContent) {
                        const courseContent = courseData.courseDetails.courseContent;
                        const firstSec = courseContent[0];
                        const secId = firstSec?._id || (firstSec as any)?.id;
                        
                        // Manejar tanto subSection como subSections
                        const subs = firstSec?.subSection || (firstSec as any)?.subSections;
                        const firstSub = Array.isArray(subs) && subs.length > 0 ? subs[0] : null;
                        const subSecId = firstSub?._id || (firstSub as any)?.id;
                        
                        if (secId && subSecId) {
                          router.push(
                            `/view-course/${courseId}/section/${secId}/sub-section/${subSecId}`
                          );
                        } else {
                          // Si no hay lecciones, navegar al curso de todas formas
                          router.push(`/view-course/${courseId}`);
                        }
                      } else {
                        // Si no hay contenido, navegar al curso de todas formas
                        router.push(`/view-course/${courseId}`);
                      }
                    } catch (error) {
                      console.error("Error loading course details:", error);
                      // En caso de error, intentar navegar de todas formas
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

              {/* only for smaller devices */}
              {/* duration -  progress */}
              <div className="sm:hidden">
                <div className=" px-2 py-3">{formatTotalDuration(course?.totalDuration)}</div>

                <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                  {/* {console.log('Course ============== ', course.progressPercentage)} */}

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

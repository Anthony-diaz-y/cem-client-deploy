"use client";

import { useAppSelector } from "@shared/store/hooks";

import { useState, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useRouter } from "next/navigation";

import { formatDate } from "@shared/utils/formatDate";
import { formatTotalDuration } from "@shared/utils/durationHelper";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "@shared/services/courseDetailsAPI";
import { COURSE_STATUS } from "@shared/utils/constants";
import ConfirmationModal from "@shared/components/ConfirmationModal";
import Img from "@shared/components/Img";
import toast from "react-hot-toast";
import { Course, CoursesTableProps, ConfirmationModalData } from "../types";

export type { Course };

const MIN_LOADING_TIME = 300; // Tiempo mínimo en ms antes de mostrar skeleton

export default function CoursesTable({
  courses,
  setCourses,
  loading,
  setLoading,
}: CoursesTableProps) {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const TRUNCATE_LENGTH = 25;

  // Controlar cuándo mostrar skeleton con delay mínimo
  useEffect(() => {
    if (loading && (!courses || courses.length === 0)) {
      // Solo mostrar skeleton si está cargando y no hay cursos
      timeoutRef.current = setTimeout(() => {
        // Solo mostrar skeleton si todavía está cargando después del delay mínimo
        if (loading && (!courses || courses.length === 0)) {
          setShowSkeleton(true);
        }
      }, MIN_LOADING_TIME);
    } else {
      // Si terminó de cargar o hay cursos, ocultar skeleton inmediatamente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowSkeleton(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, courses]);

  // delete course
  const handleCourseDelete = async (courseId: string) => {
    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }
    
    setLoading(true);
    try {
      await deleteCourse({ courseId: courseId }, token);
      // Solo refrescar la lista si la eliminación fue exitosa
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
      setConfirmationModal(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      // El error ya se maneja en deleteCourse con toast
    } finally {
      setLoading(false);
    }
  };

  // Loading Skeleton
  const skItem = () => {
    return (
      <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className="h-[148px] min-w-[300px] rounded-xl skeleton "></div>

          <div className="flex flex-col w-[40%]">
            <p className="h-5 w-[50%] rounded-xl skeleton"></p>
            <p className="h-20 w-[60%] rounded-xl mt-3 skeleton"></p>

            <p className="h-2 w-[20%] rounded-xl skeleton mt-3"></p>
            <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-richblack-800 overflow-hidden">
        <table className="w-full">
          {/* heading */}
          <thead>
            <tr className="flex gap-x-10 rounded-t-3xl border-b border-b-richblack-800 px-6 py-2">
              <th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                Courses
              </th>
              <th className="text-left text-sm font-medium uppercase text-richblack-100">
                Duration
              </th>
              <th className="text-left text-sm font-medium uppercase text-richblack-100">
                Lectures
              </th>
              <th className="text-left text-sm font-medium uppercase text-richblack-100">
                Price
              </th>
              <th className="text-left text-sm font-medium uppercase text-richblack-100">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
          {/* Mostrar skeleton solo si la carga toma más de 300ms (evita parpadeo rápido) */}
          {showSkeleton ? (
            <>
              <tr>
                <td colSpan={5}>{skItem()}</td>
              </tr>
              <tr>
                <td colSpan={5}>{skItem()}</td>
              </tr>
              <tr>
                <td colSpan={5}>{skItem()}</td>
              </tr>
            </>
          ) : courses?.length === 0 ? (
            <tr>
              <td
                className="py-10 text-center text-2xl font-medium text-richblack-100"
                colSpan={5}
              >
                No courses found
              </td>
            </tr>
          ) : (
            courses?.map((course: Course, index: number) => {
              // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
              const courseId = (course as any)?.id || course?._id || `course-${index}`;
              
              return (
              <tr
                key={courseId}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                <td className="flex flex-1 gap-x-4 relative">
                  {/* course Thumbnail */}
                  <Img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover"
                  />

                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-richblack-5 capitalize">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-richblack-300 ">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>

                    {/* created At */}
                    <p className="text-[12px] text-richblack-100 mt-4">
                      Created: {formatDate(course?.createdAt)}
                    </p>

                    {/* updated At */}
                    <p className="text-[12px] text-richblack-100 ">
                      updated: {formatDate(course?.updatedAt)}
                    </p>

                    {/* course status */}
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <div className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </p>
                        Published
                      </div>
                    )}
                  </div>
                </td>

                {/* course duration */}
                <td className="text-sm font-medium text-richblack-100">
                  {(() => {
                    const formatted = formatTotalDuration(course.totalDuration);
                    return formatted !== 'N/A' ? (
                      <span className="text-richblack-5">{formatted}</span>
                    ) : (
                      <span className="text-richblack-400">N/A</span>
                    );
                  })()}
                </td>
                
                {/* course lectures */}
                <td className="text-sm font-medium text-richblack-100">
                  <span className="text-richblack-5">
                    {course.totalLectures || 0} {course.totalLectures === 1 ? 'lecture' : 'lectures'}
                  </span>
                </td>
                
                <td className="text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </td>

                <td className="text-sm font-medium text-richblack-100 ">
                  {/* Edit button */}
                  <button
                    disabled={loading}
                    onClick={() => {
                      router.push(`/dashboard/edit-course/${courseId}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>

                  {/* Delete button */}
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(courseId)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </td>
              </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

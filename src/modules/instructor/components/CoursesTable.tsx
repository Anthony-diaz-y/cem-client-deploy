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
import { ConfirmationModal, Img } from "@shared/components";
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

  const handleCourseDelete = async (courseId: string) => {
    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }

    setLoading(true);
    try {
      await deleteCourse({ courseId: courseId }, token);
      const result = await fetchInstructorCourses(token);
      if (result && Array.isArray(result)) {
        setCourses(result as unknown as Course[]);
      }
      setConfirmationModal(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading Skeleton
  const skItem = () => {
    return (
      <div className="flex border-b border-cem-neutral-gray-100 px-6 py-8 w-full bg-cem-cardbackground">
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
      <div className="rounded-2xl border border-cem-neutral-gray-200 overflow-hidden bg-cem-cardbackground shadow-sm">
        <table className="w-full">
          {/* heading */}
          <thead>
            <tr className="flex gap-x-10 border-b border-cem-neutral-gray-200 bg-cem-neutral-gray-50 px-6 py-4">
              <th className="flex-1 text-left text-xs font-bold uppercase tracking-wider text-cem-neutral-gray-600">
                Courses
              </th>
              <th className="text-left text-xs font-bold uppercase tracking-wider text-cem-neutral-gray-600">
                Duration
              </th>
              <th className="text-left text-xs font-bold uppercase tracking-wider text-cem-neutral-gray-600">
                Lectures
              </th>
              <th className="text-left text-xs font-bold uppercase tracking-wider text-cem-neutral-gray-600">
                Price
              </th>
              <th className="text-left text-xs font-bold uppercase tracking-wider text-cem-neutral-gray-600">
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
            ) : !loading && courses?.length === 0 ? (
              <tr>
                <td
                  className="py-12 text-center text-xl font-medium text-cem-neutral-gray-400"
                  colSpan={5}
                >
                  No courses found
                </td>
              </tr>
            ) : (
              courses?.map((course: Course, index: number) => {
                const courseId = course.id || course._id || `course-${index}`;

                return (
                  <tr
                    key={courseId}
                    className="flex gap-x-10 border-b border-cem-neutral-gray-100 px-6 py-8 transition-colors hover:bg-cem-neutral-gray-50/50 bg-cem-cardbackground"
                  >
                    <td className="flex flex-1 gap-x-4 relative">
                      {/* course Thumbnail */}
                      <Img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover"
                      />

                      <div className="flex flex-col">
                        <p className="text-lg font-bold text-cem-neutral-gray-900 capitalize">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-cem-neutral-gray-500 line-clamp-2">
                          {course.courseDescription.split(" ").length >
                            TRUNCATE_LENGTH
                            ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                            : course.courseDescription}
                        </p>

                        {/* created At */}
                        <p className="text-[11px] font-bold text-cem-neutral-gray-400 mt-4 uppercase tracking-tighter">
                          Creado: {formatDate(course?.createdAt)}
                        </p>

                        <p className="text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-tighter">
                          Actualizado: {formatDate(course?.updatedAt)}
                        </p>

                        {/* course status */}
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <p className="mt-2 flex w-fit flex-row items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold text-pink-600 border border-pink-100 uppercase">
                            <HiClock size={12} />
                            Borrador
                          </p>
                        ) : (
                          <div className="mt-2 flex w-fit flex-row items-center gap-1.5 rounded-full bg-cem-teal-50 px-3 py-1 text-[11px] font-bold text-cem-primary border border-cem-teal-100 uppercase">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cem-primary text-white">
                              <FaCheck size={8} />
                            </div>
                            Publicado
                          </div>
                        )}
                      </div>
                    </td>

                    {/* course duration */}
                    <td className="text-sm font-bold text-cem-neutral-gray-700 flex flex-col justify-center">
                      {(() => {
                        const totalDuration = course.totalDuration;
                        const totalDurationNumber = typeof totalDuration === 'string'
                          ? (isNaN(Number(totalDuration)) ? undefined : Number(totalDuration))
                          : totalDuration;
                        const formatted = formatTotalDuration(totalDurationNumber);
                        return formatted !== 'N/A' ? (
                          <span className="text-cem-neutral-gray-900">{formatted}</span>
                        ) : (
                          <span className="text-cem-neutral-gray-400">N/A</span>
                        );
                      })()}
                    </td>

                    <td className="text-sm font-bold text-cem-neutral-gray-700 flex flex-col justify-center">
                      <span className="text-cem-neutral-gray-900">
                        {course.totalLectures || 0} {course.totalLectures === 1 ? 'lección' : 'lecciones'}
                      </span>
                    </td>

                    <td className="text-base font-black text-cem-primary flex flex-col justify-center">
                      S/ {course.price}
                    </td>

                    <td className="text-sm font-medium text-cem-neutral-gray-600 flex items-center gap-2">
                      {/* Edit button */}
                      <button
                        disabled={loading}
                        onClick={() => {
                          router.push(`/dashboard/edit-course/${courseId}`);
                        }}
                        title="Edit"
                        className="px-2 transition-all duration-200 hover:scale-110 hover:text-cem-primary"
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
                              : () => { },
                            btn2Handler: !loading
                              ? () => setConfirmationModal(null)
                              : () => { },
                          });
                        }}
                        title="Delete"
                        className="px-1 transition-all duration-200 hover:scale-110 hover:text-red-600"
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

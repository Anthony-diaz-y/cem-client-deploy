"use client";

import { useAppSelector } from "@shared/store/hooks";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useRouter } from "next/navigation";

import { formatDate } from "@shared/utils/formatDate";
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
  const TRUNCATE_LENGTH = 25;

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
      <Table className="rounded-2xl border border-richblack-800 ">
        {/* heading */}
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-3xl border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Lectures
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {/* loading Skeleton */}
          {loading ? (
            <>
              <Tr>
                <Td colSpan={5}>{skItem()}</Td>
              </Tr>
              <Tr>
                <Td colSpan={5}>{skItem()}</Td>
              </Tr>
              <Tr>
                <Td colSpan={5}>{skItem()}</Td>
              </Tr>
            </>
          ) : courses?.length === 0 ? (
            <Tr>
              <Td
                className="py-10 text-center text-2xl font-medium text-richblack-100"
                colSpan={5}
              >
                No courses found
              </Td>
            </Tr>
          ) : (
            courses?.map((course, index) => {
              // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
              const courseId = (course as any)?.id || course?._id || `course-${index}`;
              
              return (
              <Tr
                key={courseId}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                <Td className="flex flex-1 gap-x-4 relative">
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
                </Td>

                {/* course duration */}
                <Td className="text-sm font-medium text-richblack-100">
                  {course.totalDuration && course.totalDuration !== '0h 0m' && course.totalDuration !== '0m 0s' ? (
                    <span className="text-richblack-5">{course.totalDuration}</span>
                  ) : (
                    <span className="text-richblack-400">N/A</span>
                  )}
                </Td>
                
                {/* course lectures */}
                <Td className="text-sm font-medium text-richblack-100">
                  <span className="text-richblack-5">
                    {course.totalLectures || 0} {course.totalLectures === 1 ? 'lecture' : 'lectures'}
                  </span>
                </Td>
                
                <Td className="text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </Td>

                <Td className="text-sm font-medium text-richblack-100 ">
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
                </Td>
              </Tr>
              );
            })
          )}
        </Tbody>
      </Table>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

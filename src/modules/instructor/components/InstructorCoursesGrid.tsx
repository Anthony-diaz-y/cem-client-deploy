"use client";

import React from "react";
import Link from "next/link";
import { Img } from "@shared/components";
import { InstructorCoursesGridProps } from "../types";
import { FaCheck } from "react-icons/fa";
import { HiClock } from "react-icons/hi";
import { COURSE_STATUS } from "@shared/utils/constants";
import { INSTRUCTOR_TEXTS } from "../constants/instructor.constants";

/**
 * InstructorCoursesGrid - Courses grid component for instructor dashboard
 * Displays instructor's courses
 */
const InstructorCoursesGrid: React.FC<InstructorCoursesGridProps> = ({
  courses,
}) => {
  return (
    <div className="rounded-md bg-cem-cardbackground border border-cem-neutral-gray-200 p-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-cem-neutral-gray-900">{INSTRUCTOR_TEXTS.courses.yourCourses}</p>
        <Link href={INSTRUCTOR_TEXTS.links.myCourses}>
          <p className="text-xs font-semibold text-cem-primary hover:underline">
            {INSTRUCTOR_TEXTS.courses.viewAll}
          </p>
        </Link>
      </div>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {courses.slice(0, 3).map((course, index) => {
          // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
          const courseId = (course as any)?.id || course?._id || `course-${index}`;
          return (
          <div
            key={courseId}
            className="flex flex-col w-full"
          >
            <div className="w-full h-[201px] rounded-2xl overflow-hidden relative bg-cem-neutral-gray-100">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.courseName || "course thumbnail"}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'absolute inset-0 bg-gradient-to-br from-cem-neutral-gray-100 to-cem-neutral-gray-200 flex flex-col items-center justify-center';
                    placeholder.innerHTML = `
                      <svg class="w-12 h-12 text-cem-neutral-gray-400 opacity-60 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="text-cem-neutral-gray-500 text-xs">${INSTRUCTOR_TEXTS.courses.grid.noImage}</span>
                    `;
                    target.parentElement?.appendChild(placeholder);
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-cem-neutral-gray-100 to-cem-neutral-gray-200 flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-cem-neutral-gray-400 opacity-60 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-cem-neutral-gray-500 text-xs">{INSTRUCTOR_TEXTS.courses.grid.noImage}</span>
                </div>
              )}
            </div>

            <div className="mt-3 w-full">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-cem-neutral-gray-900 flex-1">
                  {course.courseName}
                </p>
                {/* Status Badge - Diseño profesional similar a My Courses */}
                {course.status === COURSE_STATUS.DRAFT || course.status === 'Draft' ? (
                  <div className="ml-2 flex w-fit flex-row items-center gap-1.5 rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-pink-600 border border-pink-100 shadow-sm">
                    <HiClock size={12} className="flex-shrink-0" />
                    <span>{INSTRUCTOR_TEXTS.courses.grid.status.drafted}</span>
                  </div>
                ) : (
                  <div className="ml-2 flex w-fit flex-row items-center gap-1.5 rounded-full bg-cem-teal-50 px-2.5 py-1 text-[11px] font-medium text-cem-primary border border-cem-teal-100 shadow-sm">
                    <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-cem-primary text-cem-neutral-white flex-shrink-0">
                      <FaCheck size={8} />
                    </div>
                    <span>{INSTRUCTOR_TEXTS.courses.grid.status.published}</span>
                  </div>
                )}
              </div>
              <div className="mt-1 flex items-center space-x-2 flex-wrap">
                <p className="text-xs font-medium text-cem-neutral-gray-600">
                  {(() => {
                    // Calcular estudiantes: usar array si está disponible, sino usar totalStudentsEnrolled
                    const studentsCount = Array.isArray(course.studentsEnrolled)
                      ? course.studentsEnrolled.length
                      : (course.totalStudentsEnrolled || 0);
                    return studentsCount;
                  })()} {INSTRUCTOR_TEXTS.courses.grid.students}
                </p>
                <p className="text-xs font-medium text-cem-neutral-gray-600">|</p>
                <p className="text-xs font-medium text-cem-neutral-gray-600">
                  {INSTRUCTOR_TEXTS.stats.currencyPrefix} {course.price}
                </p>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default InstructorCoursesGrid;

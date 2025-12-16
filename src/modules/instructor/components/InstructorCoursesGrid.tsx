'use client'

import React from "react"
import Link from "next/link"
import Img from "../../../shared/components/Img"
import { Course } from "../types"

interface InstructorCoursesGridProps {
  courses: Course[]
}

/**
 * InstructorCoursesGrid - Courses grid component for instructor dashboard
 * Displays instructor's courses
 */
const InstructorCoursesGrid: React.FC<InstructorCoursesGridProps> = ({ courses }) => {
  return (
    <div className="rounded-md bg-richblack-800 p-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-richblack-5">Your Courses</p>
        <Link href="/dashboard/my-courses">
          <p className="text-xs font-semibold text-yellow-50 hover:underline">
            View All
          </p>
        </Link>
      </div>

      <div className="my-4 flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
        {courses.slice(0, 3).map((course) => (
          <div
            key={course._id}
            className="sm:w-1/3 flex flex-col items-center justify-center"
          >
            <Img
              src={course.thumbnail}
              alt={course.courseName}
              className="h-[201px] w-full rounded-2xl object-cover"
            />

            <div className="mt-3 w-full">
              <p className="text-sm font-medium text-richblack-50">
                {course.courseName}
              </p>
              <div className="mt-1 flex items-center space-x-2">
                <p className="text-xs font-medium text-richblack-300">
                  {course.studentsEnrolled?.length || 0} students
                </p>
                <p className="text-xs font-medium text-richblack-300">|</p>
                <p className="text-xs font-medium text-richblack-300">
                  Rs. {course.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InstructorCoursesGrid


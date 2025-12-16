'use client'

import React from "react"

interface InstructorStatsProps {
  totalCourses: number
  totalStudents: number
  totalAmount: number
}

/**
 * InstructorStats - Statistics component for instructor dashboard
 * Displays total courses, students, and income
 */
const InstructorStats: React.FC<InstructorStatsProps> = ({
  totalCourses,
  totalStudents,
  totalAmount,
}) => {
  return (
    <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Statistics</p>
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-lg text-richblack-200">Total Courses</p>
          <p className="text-3xl font-semibold text-richblack-50">
            {totalCourses}
          </p>
        </div>
        <div>
          <p className="text-lg text-richblack-200">Total Students</p>
          <p className="text-3xl font-semibold text-richblack-50">
            {totalStudents}
          </p>
        </div>
        <div>
          <p className="text-lg text-richblack-200">Total Income</p>
          <p className="text-3xl font-semibold text-richblack-50">
            Rs. {totalAmount}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InstructorStats


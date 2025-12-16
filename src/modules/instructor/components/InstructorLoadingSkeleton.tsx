'use client'

import React from "react"
import Link from "next/link"

/**
 * InstructorLoadingSkeleton - Loading skeleton component for instructor dashboard
 */
const InstructorLoadingSkeleton: React.FC = () => {
  return (
    <div className="mt-5 w-full flex flex-col justify-between rounded-xl">
      <div className="flex border p-4 border-richblack-600">
        <div className="w-full">
          <p className="w-[100px] h-4 rounded-xl skeleton"></p>
          <div className="mt-3 flex gap-x-5">
            <p className="w-[200px] h-4 rounded-xl skeleton"></p>
            <p className="w-[100px] h-4 rounded-xl skeleton"></p>
          </div>

          <div className="flex justify-center items-center flex-col">
            <div className="w-[80%] h-24 rounded-xl mt-5 skeleton"></div>
            <div className="w-60 h-60 rounded-full mt-4 grid place-items-center skeleton"></div>
          </div>
        </div>
        <div className="sm:flex hidden min-w-[250px] flex-col rounded-xl p-6 skeleton"></div>
      </div>

      <div className="flex flex-col gap-y-6 mt-5">
        <div className="flex justify-between">
          <p className="text-lg font-bold text-richblack-5 pl-5">
            Your Courses
          </p>
          <Link href="/dashboard/my-courses">
            <p className="text-xs font-semibold text-yellow-50 hover:underline pr-5">
              View All
            </p>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <p className="h-[201px] w-full rounded-xl skeleton"></p>
          <p className="h-[201px] w-full rounded-xl skeleton"></p>
          <p className="h-[201px] w-full rounded-xl skeleton"></p>
        </div>
      </div>
    </div>
  )
}

export default InstructorLoadingSkeleton


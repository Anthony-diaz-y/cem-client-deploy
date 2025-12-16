'use client'

import React from "react"

/**
 * CourseLoadingSkeleton - Loading skeleton component for course details
 * Displays placeholder content while course data is loading
 */
const CourseLoadingSkeleton: React.FC = () => {
  return (
    <div className={`mt-24 p-5 flex flex-col justify-center gap-4`}>
      <div className="flex flex-col sm:flex-col-reverse gap-4">
        <p className="h-44 sm:h-24 sm:w-[60%] rounded-xl skeleton"></p>
        <p className="h-9 sm:w-[39%] rounded-xl skeleton"></p>
      </div>
      <p className="h-4 w-[55%] lg:w-[25%] rounded-xl skeleton"></p>
      <p className="h-4 w-[75%] lg:w-[30%] rounded-xl skeleton"></p>
      <p className="h-4 w-[35%] lg:w-[10%] rounded-xl skeleton"></p>
      <div className="right-[1.5rem] top-[20%] hidden lg:block lg:absolute min-h-[450px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 rounded-xl skeleton"></div>
      <p className="mt-24 h-60 lg:w-[60%] rounded-xl skeleton"></p>
    </div>
  )
}

export default CourseLoadingSkeleton


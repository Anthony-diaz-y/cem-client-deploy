"use client";

import React from "react";

/**
 * CourseLoadingSkeleton - Loading skeleton for course details
 */
const CourseLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-cem-neutral-white course-details-enter">
      <div className="mx-auto max-w-[1260px] px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="h-8 w-24 rounded skeleton" />
            <div className="h-10 w-3/4 rounded skeleton" />
            <div className="h-4 w-full rounded skeleton" />
            <div className="h-4 w-2/3 rounded skeleton" />
            <div className="h-6 w-48 rounded skeleton" />
            <div className="h-32 w-full rounded skeleton" />
            <div className="h-32 w-full rounded skeleton" />
          </div>
          <div className="lg:w-[380px]">
            <div className="aspect-video rounded-2xl skeleton" />
            <div className="h-8 w-20 mt-6 rounded skeleton" />
            <div className="h-12 w-full mt-4 rounded skeleton" />
            <div className="h-12 w-full mt-3 rounded skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLoadingSkeleton;

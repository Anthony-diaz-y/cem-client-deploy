"use client";

import React from "react";

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-cem-neutral-gray-200 overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      {/* Thumbnail Placeholder */}
      <div className="relative w-full h-48 md:h-40 bg-cem-neutral-gray-100"></div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Category Placeholder */}
        <div className="h-3 w-20 bg-cem-neutral-gray-100 rounded"></div>

        <div className="space-y-2">
          {/* Title Placeholder */}
          <div className="h-5 w-full bg-cem-neutral-gray-100 rounded"></div>
          <div className="h-5 w-2/3 bg-cem-neutral-gray-100 rounded"></div>
        </div>

        {/* Description Placeholder */}
        <div className="space-y-1.5 mt-2">
          <div className="h-3 w-full bg-cem-neutral-gray-50 rounded"></div>
          <div className="h-3 w-full bg-cem-neutral-gray-50 rounded"></div>
        </div>

        {/* Rating Placeholder */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-12 bg-cem-neutral-gray-100 rounded"></div>
          <div className="h-4 w-24 bg-cem-neutral-gray-100 rounded"></div>
        </div>

        {/* Footer Placeholder */}
        <div className="mt-auto pt-3 border-t border-cem-neutral-gray-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-full bg-cem-neutral-gray-100"></div>
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-20 bg-cem-neutral-gray-100 rounded"></div>
              <div className="h-2 w-16 bg-cem-neutral-gray-50 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="h-5 w-16 bg-cem-neutral-gray-100 rounded"></div>
            <div className="h-3 w-12 bg-cem-neutral-gray-50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;

"use client";

import React from "react";

const CategorySkeletonCard = () => (
  <div className="min-w-[280px] p-4 rounded-xl border border-cem-neutral-gray-100 bg-white flex items-center gap-4 shadow-sm animate-pulse">
    {/* Icon Placeholder */}
    <div className="w-12 h-12 rounded-lg bg-cem-neutral-gray-100 flex-shrink-0"></div>

    <div className="flex flex-col gap-2 w-full">
      {/* Name Placeholder */}
      <div className="h-4 w-3/4 bg-cem-neutral-gray-100 rounded"></div>
      {/* Count Placeholder */}
      <div className="h-3 w-1/4 bg-cem-neutral-gray-50 rounded"></div>
    </div>
  </div>
);

export const CategorySkeleton = () => {
  return (
    <div className="space-y-12">
      {[1, 2].map((domainIndex) => (
        <div key={domainIndex}>
          {/* Domain Title Placeholder */}
          <div className="h-6 w-48 bg-cem-neutral-gray-100 rounded mx-auto mb-6 animate-pulse"></div>

          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4].map((itemIndex) => (
              <CategorySkeletonCard key={itemIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;

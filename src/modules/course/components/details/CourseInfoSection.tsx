"use client";

import React from "react";
import { CourseInfoSectionProps } from "../../types";
import { COURSE_TEXTS } from "../../constants/course.constants";

/**
 * CourseInfoSection - Section for course information
 * Displays what you'll learn and tags
 */
const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({
  whatYouWillLearn,
  tag,
}) => {
  return (
    <div className="mb-12">
      {/* What you'll learn */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cem-neutral-gray-900 mb-4">
          {COURSE_TEXTS.infoSection.whatYouWillLearn}
        </h2>
        <div className="space-y-4 text-cem-neutral-gray-700 leading-relaxed text-[16px]">
          {whatYouWillLearn ? (
            whatYouWillLearn
              .split("\n")
              .map((line, index) => <p key={index}>{line}</p>)
          ) : (
            <p>No hay información disponible.</p>
          )}
        </div>
      </div>

      {/* Tags */}
      {tag && tag.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[16px] text-cem-neutral-gray-700 mr-1">
            {COURSE_TEXTS.infoSection.tags}
          </span>
          {tag.map((item, ind) => (
            <span
              key={ind}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-cem-primary text-white tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default hover:bg-[#026e85]"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseInfoSection;

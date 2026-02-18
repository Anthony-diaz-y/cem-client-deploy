"use client";

import React from "react";
import { CourseInfoSectionProps } from "../../types";
import { COURSE_TEXTS } from "../../constants/course.constants";

/**
 * CourseInfoSection - Section for course information
 * Displays what you'll learn and tags
 */
const CourseInfoSection: React.FC<Omit<CourseInfoSectionProps, "categories">> = ({
  whatYouWillLearn,
}) => {
  return (
    <div className="mb-0">
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
    </div>
  );
};

export default CourseInfoSection;

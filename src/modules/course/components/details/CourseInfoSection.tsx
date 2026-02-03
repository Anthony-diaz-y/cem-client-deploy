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
  categories,
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

      {/* Tags/Categories */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[16px] text-cem-neutral-gray-700 mr-1">
            Etiquetas:
          </span>
          {categories.map((category, ind) => {
            // Colors palette similar to the requested design (Pastel backgrounds with darker text)
            // Pink, Green, Blue, Purple, Amber, Cyan
            const colors = [
              "bg-pink-100 text-pink-700",
              "bg-green-100 text-green-700",
              "bg-blue-100 text-blue-700",
              "bg-purple-100 text-purple-700",
              "bg-amber-100 text-amber-700",
              "bg-cyan-100 text-cyan-700",
            ];
            const colorClass = colors[ind % colors.length];

            return (
              <span
                key={ind}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-default ${colorClass}`}
              >
                {category.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseInfoSection;

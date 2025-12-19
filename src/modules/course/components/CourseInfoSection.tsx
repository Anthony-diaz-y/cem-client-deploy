"use client";

import React from "react";
import { CourseInfoSectionProps } from "../types";

/**
 * CourseInfoSection - Section component for course information
 * Displays what you'll learn and tags
 */
const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({
  whatYouWillLearn,
  tag,
}) => {
  return (
    <>
      {/* What you'll learn */}
      <div className="my-8 border border-richblack-600 p-8">
        <p className="text-3xl font-semibold">Lo que aprenderás</p>
        <div className="mt-3">
          {whatYouWillLearn &&
            whatYouWillLearn.split("\n").map((line, index) => (
              <div key={index} className="flex items-center mb-2">
                <p className="font-bold">{index + 1}.</p>
                <p className="ml-2">{line}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col lg:flex-row gap-4">
        <p className="text-xl font-bold">Etiquetas</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tag &&
            tag.map((item, ind) => (
              <p
                key={ind}
                className="bg-yellow-50 p-[2px] text-black rounded-full text-center font-semibold"
              >
                {item}
              </p>
            ))}
        </div>
      </div>
    </>
  );
};

export default CourseInfoSection;

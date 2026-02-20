"use client";

import React from "react";
import { CourseAccordionBar } from "./";
import { CourseContentSectionProps } from "../../types";
import { COURSE_TEXTS } from "../../constants/course.constants";

/**
 * CourseContentSection - Section for course content
 * Displays course sections in accordion format matching design Step 1131
 */
const CourseContentSection: React.FC<CourseContentSectionProps> = ({
  response,
  isActive,
  handleActive,
}) => {
  const { courseContent } = response.data.courseDetails;

  return (
    <div className="mb-12">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[28px] font-bold text-cem-neutral-gray-900">
          {COURSE_TEXTS.contentSection.title}
        </h2>
      </div>

      <div className="w-full">
        {courseContent?.map((course, index) => (
          <CourseAccordionBar
            course={course}
            key={index}
            id={course._id || index.toString()}
            isActive={isActive}
            handleActive={handleActive}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseContentSection;

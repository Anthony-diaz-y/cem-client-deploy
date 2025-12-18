"use client";

import React from "react";
import CourseAccordionBar from "./CourseAccordionBar";
import { CourseContentSectionProps } from "../types";
import { formatTotalDuration } from "@shared/utils/durationHelper";

/**
 * CourseContentSection - Section component for course content
 * Displays course sections, lectures count, and accordion
 */
const CourseContentSection: React.FC<CourseContentSectionProps> = ({
  response,
  totalNoOfLectures,
  isActive,
  handleActive,
  onCollapseAll,
}) => {
  const { courseContent } = response.data.courseDetails;

  return (
    <div className="max-w-[830px] mt-9">
      <div className="flex flex-col gap-3">
        <p className="text-[28px] font-semibold">Course Content</p>
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <span>
              {courseContent.length} {`section(s)`}
            </span>
            <span>
              {totalNoOfLectures} {`lecture(s)`}
            </span>
            <span>{formatTotalDuration(response.data?.totalDuration)} Total Time</span>
          </div>
          <button className="text-yellow-25" onClick={onCollapseAll}>
            Collapse All Sections
          </button>
        </div>
      </div>

      {/* Accordion */}
      <div className="py-4">
        {courseContent?.map((course, index) => (
          <CourseAccordionBar
            course={course}
            key={index}
            isActive={isActive}
            handleActive={handleActive}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseContentSection;

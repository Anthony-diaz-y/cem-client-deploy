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
        <p className="text-[28px] font-semibold">Contenido del Curso</p>
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <span>
              {courseContent.length} {courseContent.length === 1 ? 'sección' : 'secciones'}
            </span>
            <span>
              {totalNoOfLectures} {totalNoOfLectures === 1 ? 'lección' : 'lecciones'}
            </span>
            <span>{formatTotalDuration(response.data?.totalDuration)} Tiempo Total</span>
          </div>
          <button className="text-yellow-25" onClick={onCollapseAll}>
            Colapsar Todas las Secciones
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

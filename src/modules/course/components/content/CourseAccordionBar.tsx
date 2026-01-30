"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { CourseSubSectionAccordion } from "./";
import { CourseAccordionBarProps, SubSection } from "../../types";

/**
 * CourseAccordionBar - Accordion item for course section
 * Displays section name with expandable content
 */
export default function CourseAccordionBar({
  course,
  isActive,
  handleActive,
  id,
}: CourseAccordionBarProps) {
  const contentEl = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState(0);

  // Use the provided ID or fallback to course._id
  const sectionId = id || course._id;

  const active = useMemo(
    () => isActive?.includes(sectionId) ?? false,
    [isActive, sectionId],
  );

  const subSectionsArray = useMemo(() => {
    if (course.subSection && Array.isArray(course.subSection)) {
      return course.subSection;
    }
    if (
      (course as any).subSections &&
      Array.isArray((course as any).subSections)
    ) {
      return (course as any).subSections;
    }
    return [];
  }, [course]);

  useEffect(() => {
    const updateHeight = () => {
      if (contentEl.current) {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0);
      }
    };
    const timeoutId = setTimeout(updateHeight, 0);
    return () => clearTimeout(timeoutId);
  }, [active, subSectionsArray]);

  const firstSubSectionDescription = subSectionsArray[0]?.description;

  return (
    <div className="bg-white">
      <div
        className="w-full flex items-center justify-between py-5 px-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => handleActive(sectionId)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span
            className={`text-2xl font-medium flex-shrink-0 transition-transform duration-200 ${
              active ? "text-cem-primary rotate-45" : "text-cem-primary"
            }`}
          >
            +
          </span>
          <span className="text-lg font-bold text-cem-neutral-gray-900 truncate">
            {course?.sectionName}
          </span>
        </div>
        <div
          className={`flex-shrink-0 ml-4 transition-transform duration-200 ${
            active ? "rotate-180 text-cem-primary" : "text-cem-neutral-gray-400"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div
        ref={contentEl}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          height: sectionHeight,
          opacity: active ? 1 : 0,
        }}
      >
        <div className="pb-6 px-6">
          <p className="text-cem-neutral-gray-600 leading-relaxed text-[15px]">
            {firstSubSectionDescription ||
              "El curso de Biología Molecular explora en profundidad cómo las moléculas como el ADN, ARN y proteínas controlan los procesos fundamentales de la vida celular."}
          </p>
        </div>
      </div>
    </div>
  );
}

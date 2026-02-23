"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { CourseAccordionBarProps, Section, SubSection } from "../../types";

/**
 * CourseAccordionBar - Accordion item for course section
 * Displays section name with expandable content matching the design in Step 1131
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
    const c = course as Section & { subSections?: SubSection[] };
    if (c.subSection && Array.isArray(c.subSection)) {
      return c.subSection;
    }
    if (c.subSections && Array.isArray(c.subSections)) {
      return c.subSections;
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

  return (
    <div className="bg-white border-b border-cem-neutral-gray-300 last:border-b-0">
      <div
        className="w-full flex items-center justify-between py-6 px-1 cursor-pointer transition-colors"
        onClick={() => handleActive(sectionId)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Blue Plus Icon */}
          <span
            className={`text-xl font-bold flex-shrink-0 text-cem-primary transition-transform duration-300 ${active ? "rotate-45" : ""
              }`}
          >
            +
          </span>
          {/* Blue Title */}
          <span className={`text-[20px] font-bold truncate transition-colors duration-300 ${active ? "text-cem-primary" : "text-cem-primary"
            }`}>
            {course?.sectionName}
          </span>
        </div>

        {/* Circular Chevron Icon */}
        <div
          className={`flex-shrink-0 ml-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${active
            ? "bg-transparent border-cem-primary text-cem-primary rotate-180"
            : "bg-transparent border-cem-neutral-gray-400 text-cem-neutral-gray-400"
            }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
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
        <div className="pb-8 pl-10 pr-6 space-y-6">
          {subSectionsArray.length > 0 ? (
            subSectionsArray.map((sub: SubSection, index: number) => (
              <div key={sub._id || index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cem-primary mt-2 flex-shrink-0" />
                  <h4 className="text-[17px] font-bold text-cem-neutral-gray-900">
                    {sub.title}
                  </h4>
                </div>
                {sub.description && (
                  <div
                    className="text-cem-neutral-gray-700 leading-relaxed text-[15px] ml-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: sub.description }}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-cem-neutral-gray-800 leading-relaxed text-[16px] italic opacity-60">
              No hay lecciones en esta sección.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Img } from "@shared/components";
import { CourseAuthorSectionProps } from "../../types";
import { COURSE_TEXTS } from "../../constants/course.constants";

import Image from "next/image";
import socialIcon from "@shared/assets/social/social-Icon.webp";

/**
 * CourseAuthorSection - Sección Experto
 * Muestra nombre del docente, título profesional e imagen
 * Compatible con estructura de getAllCourses (name, professional_title) y course details (firstName, lastName, additionalDetails.about)
 */
const CourseAuthorSection: React.FC<CourseAuthorSectionProps> = ({
  instructor,
}) => {
  const displayName =
    instructor?.name ??
    [instructor?.firstName, instructor?.lastName].filter(Boolean).join(" ") ??
    "Experto";

  const professionalTitle =
    instructor?.professional_title ??
    instructor?.additionalDetails?.about ??
    "Experto";

  const imageUrl = instructor?.image ?? "";

  return (
    <div className="mb-0">
      <h2 className="text-2xl font-bold text-cem-neutral-gray-900 mb-6">
        {COURSE_TEXTS.expertSection.title}
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Img
            src={imageUrl}
            alt={displayName}
            className="h-14 w-14 rounded-full object-cover border border-cem-neutral-gray-200 flex-shrink-0"
          />
          <div>
            <p className="text-lg font-bold text-cem-neutral-gray-900 capitalize leading-tight">
              {displayName}
            </p>
            <p className="text-sm text-cem-neutral-gray-500">
              {professionalTitle}
            </p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3 ml-[72px]">
          {/* ORCID */}
          <a
            href={instructor?.links?.orcid || "#"}
            className="w-7 h-7 rounded-full bg-cem-neutral-gray-200 flex items-center justify-center hover:bg-cem-neutral-gray-300 transition-colors"
            aria-label="ORCID"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-[10px] font-bold text-cem-neutral-gray-600 leading-none relative">
              <span className="absolute -top-[2px] left-[2px] w-[2px] h-[2px] bg-cem-neutral-gray-600 rounded-full"></span>
              <span className="inline-block">i</span>
              <span className="inline-block">D</span>
            </span>
          </a>

          {/* ResearchGate */}
          <a
            href={instructor?.links?.researchGate || "#"}
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="ResearchGate"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative w-5 h-5">
              <Image
                src={socialIcon}
                alt="ResearchGate"
                fill
                className="object-contain"
              />
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href={instructor?.links?.linkedin || "#"}
            className="w-7 h-7 rounded-lg bg-cem-neutral-gray-200 flex items-center justify-center hover:bg-cem-neutral-gray-300 transition-colors"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-[10px] font-bold text-cem-neutral-gray-600 leading-none relative">
              <span className="absolute -top-[2px] left-[2px] w-[2px] h-[2px] bg-cem-neutral-gray-600 rounded-full"></span>
              <span className="inline-block">i</span>
              <span className="inline-block">n</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseAuthorSection;

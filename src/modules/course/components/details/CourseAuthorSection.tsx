"use client";

import React, { useState } from "react";
import { Img } from "@shared/components";
import { CourseAuthorSectionProps } from "../../types";
import { COURSE_TEXTS } from "../../constants/course.constants";
import Image from "next/image";
import socialIcon from "@shared/assets/social/social-Icon.webp";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CourseAuthorSection - Sección Experto
 * Muestra perfil del docente con diseño profesional, iconos sociales y biografía colapsable.
 */
const CourseAuthorSection: React.FC<CourseAuthorSectionProps> = ({
  instructor,
}) => {
  const [isBioExpanded, setIsBioExpanded] = useState(true);

  const displayName =
    instructor?.name ??
    [instructor?.firstName, instructor?.lastName].filter(Boolean).join(" ") ??
    "Experto";

  const professionalTitle =
    instructor?.additionalDetails?.professional_title ??
    "Experto en la materia";

  const imageUrl = instructor?.image ?? "";

  const biography =
    instructor?.additionalDetails?.biography || "No hay biografía disponible.";

  // Social Links Mapping - Reusing Home page styles/assets
  const renderSocialIcon = (type: "orcid" | "researchGate" | "linkedin") => {
    switch (type) {
      case "orcid":
        return (
          <span className="w-8 h-8 rounded-full bg-cem-neutral-gray-200 flex items-center justify-center hover:bg-cem-neutral-gray-300 transition-colors">
            <span className="text-[10px] font-bold text-cem-neutral-gray-600 leading-none relative">
              <span className="absolute -top-[2px] left-[2px] w-[2px] h-[2px] bg-cem-neutral-gray-600 rounded-full"></span>
              <span className="inline-block">i</span>
              <span className="inline-block">D</span>
            </span>
          </span>
        );
      case "researchGate":
        return (
          <div className="flex items-center justify-center hover:opacity-80 transition-opacity w-8 h-8">
            <div className="relative w-6 h-6">
              <Image
                src={socialIcon}
                alt="ResearchGate"
                fill
                className="object-contain"
              />
            </div>
          </div>
        );
      case "linkedin":
        return (
          <span className="w-8 h-8 rounded-lg bg-cem-neutral-gray-200 flex items-center justify-center hover:bg-cem-neutral-gray-300 transition-colors">
            <span className="text-[10px] font-bold text-cem-neutral-gray-600 leading-none relative">
              <span className="absolute -top-[2px] left-[2px] w-[2px] h-[2px] bg-cem-neutral-gray-600 rounded-full"></span>
              <span className="inline-block">i</span>
              <span className="inline-block">n</span>
            </span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-cem-neutral-gray-900 mb-6">
        {COURSE_TEXTS.expertSection.title}
      </h2>

      <div className="bg-cem-neutral-gray-50 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Instructor Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-sm">
              <Img
                src={imageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Instructor Info */}
          <div className="flex-1 w-full">
            <div className="text-center md:text-left mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-cem-neutral-gray-900 mb-1">
                {displayName}
              </h3>
              <p className="text-cem-primary font-medium text-lg mb-4">
                {professionalTitle}
              </p>

              {/* Social Icons Row */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                {instructor?.additionalDetails?.orcid && (
                  <a
                    href={instructor.additionalDetails.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="ORCID"
                  >
                    {renderSocialIcon("orcid")}
                  </a>
                )}
                {instructor?.additionalDetails?.cti_vitae && (
                  <a
                    href={instructor.additionalDetails.cti_vitae}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="CTI Vitae / ResearchGate"
                  >
                    {renderSocialIcon("researchGate")}
                  </a>
                )}
                {instructor?.additionalDetails?.linkedin && (
                  <a
                    href={instructor.additionalDetails.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                  >
                    {renderSocialIcon("linkedin")}
                  </a>
                )}
              </div>
            </div>

            {/* Collapsible Biography Section */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="flex items-center justify-between w-full py-2 group hover:text-cem-primary transition-colors mb-2"
                aria-expanded={isBioExpanded}
              >
                <span className="text-sm font-semibold text-cem-neutral-gray-600 group-hover:text-cem-primary">
                  Biografía
                </span>
                <span
                  className={`text-xl text-cem-neutral-gray-400 group-hover:text-cem-primary transition-transform duration-300 ${isBioExpanded ? "rotate-180" : ""}`}
                >
                  <BiChevronDown />
                </span>
              </button>

              <AnimatePresence>
                {isBioExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="text-cem-neutral-gray-600 leading-relaxed text-sm md:text-base">
                      {biography}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAuthorSection;

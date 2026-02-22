"use client";

import React, { useState } from "react";
import { LearningPath } from "@/shared/services/admin/types";
import { resolveCategoryIcon } from "../utils/categoryIcons";
import { FiChevronDown, FiChevronUp, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface LearningPathPublicCardProps {
  learningPath: LearningPath;
}

/**
 * Card de Ruta de Aprendizaje para el catálogo público con estado interno colapsable.
 * Refinado para ser más compacto y encajar en una cuadrícula de 3 columnas (Figma Image 2).
 */
export const LearningPathPublicCard: React.FC<LearningPathPublicCardProps> = ({
  learningPath,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const icon = resolveCategoryIcon(learningPath.title, learningPath.icon);

  return (
    <div className="w-full">
      <motion.div
        layout
        className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-cem-neutral-gray-50 flex flex-col transition-all duration-300 hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)]"
      >
        {/* Header - Clickable to toggle */}
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-cem-primary flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-[0_4px_12px_rgba(4,105,123,0.25)]">
              <div className="w-7 h-7 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                {icon}
              </div>
            </div>
            <h3 className="text-[15px] lg:text-[16px] font-bold text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors leading-tight">
              {learningPath.title}
            </h3>
          </div>
        </div>

        {/* Content Area (Courses) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-3 pr-1">
                {learningPath.courses && learningPath.courses.length > 0 ? (
                  learningPath.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="group w-full flex items-center justify-between p-3.5 bg-white border border-cem-neutral-gray-100 rounded-[16px] hover:border-cem-primary/30 hover:shadow-sm transition-all duration-200"
                    >
                      <span className="text-[13px] font-semibold text-cem-neutral-gray-700 group-hover:text-cem-primary transition-colors truncate pr-3">
                        {course.courseName}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-cem-primary flex items-center justify-center text-white transition-all shadow-md shadow-cem-primary/10">
                        <FiChevronRight size={14} strokeWidth={3} />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4 text-cem-neutral-gray-400 italic text-[12px]">
                    Próximamente más cursos...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Area */}
        <div className="mt-6 pt-4 border-t border-cem-neutral-gray-50 flex items-center justify-between">
          <span className="text-cem-neutral-gray-400 font-medium text-[12px] tracking-wide">
            {learningPath.courses?.length || 0} cursos en esta ruta
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`w-10 h-10 rounded-full border border-cem-neutral-gray-100 flex items-center justify-center text-cem-neutral-gray-400 hover:border-cem-primary hover:text-cem-primary transition-colors duration-300
              ${isExpanded ? "bg-cem-primary/5 text-cem-primary border-cem-primary/20" : "bg-transparent"}
            `}
          >
            <FiChevronDown size={20} strokeWidth={2} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

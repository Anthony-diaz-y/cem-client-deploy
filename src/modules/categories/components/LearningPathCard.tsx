"use client";

import React, { useState } from "react";
import { Category } from "../types";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import CourseListItem from "./CourseListItem";

interface LearningPathCardProps {
  category: Category;
  icon?: React.ReactNode;
}

/** Card component for learning paths with expandable course list */
const LearningPathCard: React.FC<LearningPathCardProps> = ({
  category,
  icon,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const courseCount = category.courses?.length || 0;

  return (
    <div className="w-full sm:w-[368px] bg-white rounded-[20px] border border-cem-neutral-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
      {/* Card Header - Clickable to toggle */}
      <div
        className="p-8 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-5">
          {/* Icon - Brand Primary background */}
          <div className="w-12 h-12 bg-cem-primary rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            {icon || "📚"}
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-cem-neutral-gray-900 font-semibold text-[19px] leading-[1.2] group-hover:text-cem-primary transition-colors">
              {category.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Expandable Course List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Course List - Individual Cards (290px width) */}
            <div className="bg-white px-8 pb-4">
              {category.courses && category.courses.length > 0 ? (
                <div className="flex flex-col items-start gap-1">
                  {category.courses.map((course) => (
                    <CourseListItem key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-cem-neutral-gray-400 text-sm italic">
                  Próximamente más rutas...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Footer - Always visible summary and toggle */}
      <div className="px-8 pb-8 pt-2 mt-auto flex items-center justify-between">
        <span className="text-[14px] text-cem-neutral-gray-500 font-medium">
          {courseCount} {courseCount === 1 ? "ruta" : "rutas"} de aprendizaje
        </span>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-9 h-9 rounded-full border border-cem-neutral-gray-200 flex items-center justify-center text-cem-neutral-gray-400 hover:text-cem-primary hover:border-cem-primary hover:bg-cem-primary/5 transition-all duration-300 ${isExpanded ? 'bg-cem-primary/5 border-cem-primary text-cem-primary' : ''}`}
          aria-label={isExpanded ? "Contraer" : "Expandir"}
          type="button"
        >
          {isExpanded ? (
            <BiChevronUp className="text-2xl" />
          ) : (
            <BiChevronDown className="text-2xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default LearningPathCard;

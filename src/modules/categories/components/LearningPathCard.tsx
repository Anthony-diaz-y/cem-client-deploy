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
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {/* Icon - Teal background */}
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
            {icon || "📚"}
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-bold text-base leading-tight">
              {category.name}
            </h3>
          </div>
        </div>

        {/* Footer with course count and toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {courseCount} {courseCount === 1 ? "ruta" : "rutas"} de aprendizaje
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            aria-label={isExpanded ? "Contraer" : "Expandir"}
            type="button"
          >
            {isExpanded ? (
              <BiChevronUp className="text-xl" />
            ) : (
              <BiChevronDown className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Course List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-200"
          >
            {/* Course List */}
            <div className="bg-white">
              {category.courses && category.courses.length > 0 ? (
                <div className="space-y-0.5 p-2">
                  {category.courses.map((course) => (
                    <CourseListItem key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                  No hay cursos disponibles
                </div>
              )}
            </div>

            {/* Footer badge */}
            <div className="px-4 py-2.5 bg-gray-50 flex items-center justify-center border-t border-gray-200">
              <span className="text-xs text-gray-600 font-medium">
                {courseCount} {courseCount === 1 ? "ruta" : "rutas"} de
                aprendizaje
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                type="button"
              >
                <BiChevronUp className="text-lg" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningPathCard;

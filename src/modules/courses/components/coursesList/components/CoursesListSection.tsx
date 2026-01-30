"use client";

import React, { useMemo } from "react";
import { CourseCard } from "./CourseCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { Course } from "../../../types";

interface CoursesListSectionProps {
  courses: Course[];
  selectedCategory?: string;
  page: number;
  limit: number;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  onPageChange?: (page: number) => void;
  loading?: boolean;
  hideHeader?: boolean;
}

const Pagination: React.FC<{
  currentPage: number;
  totalPages?: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}> = ({ currentPage, totalPages, hasNext, onPageChange, disabled }) => {
  const hasPrev = currentPage > 1;
  const canRender = totalPages ? totalPages > 1 : hasPrev || hasNext;
  if (!canRender) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || !hasPrev}
        className="p-2 rounded-md bg-white border border-cem-neutral-gray-300 text-cem-neutral-gray-700 hover:bg-cem-neutral-gray-50 hover:border-cem-primary hover:text-cem-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <FiChevronLeft size={20} />
      </button>

      <span className="text-cem-neutral-gray-700 text-sm">
        Página{" "}
        <span className="font-bold text-cem-neutral-gray-900">
          {currentPage}
        </span>{" "}
        {totalPages && totalPages > 1 && (
          <>
            de{" "}
            <span className="font-bold text-cem-neutral-gray-900">
              {totalPages}
            </span>
          </>
        )}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || !hasNext}
        className="p-2 rounded-md bg-white border border-cem-neutral-gray-300 text-cem-neutral-gray-700 hover:bg-cem-neutral-gray-50 hover:border-cem-primary hover:text-cem-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export const CoursesListSection: React.FC<CoursesListSectionProps> = ({
  courses,
  selectedCategory,
  page,
  limit,
  meta,
  onPageChange,
  hideHeader = false,
  loading = false,
}) => {
  const totalPages =
    meta?.totalPages ||
    (meta?.total && limit ? Math.ceil(meta.total / limit) : undefined);

  const hasNext = useMemo(() => {
    if (typeof totalPages === "number") return page < totalPages;
    return courses.length === limit;
  }, [courses.length, limit, page, totalPages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full py-16">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        {!hideHeader && (
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900 mb-2">
              Todos nuestros cursos
            </h2>
            <p className="text-cem-neutral-gray-500">
              {selectedCategory || "Explora nuestra oferta académica"}
            </p>
          </div>
        )}

        <div
          className={`relative min-h-[400px] transition-opacity duration-300 ${loading && courses.length > 0 ? "opacity-50" : "opacity-100"}`}
        >
          {loading && courses.length === 0 && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex items-start justify-center pt-20 transition-all duration-300">
              <div className="custom-loader"></div>
            </div>
          )}

          <motion.div
            key={page}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8`}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id || index}
                variants={itemVariants}
                className="max-w-sm mx-auto w-full md:max-w-none h-full"
              >
                <CourseCard course={course} index={index} />
              </motion.div>
            ))}
          </motion.div>

          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-cem-neutral-gray-600 text-lg">
                No hay cursos disponibles en este momento.
              </p>
            </div>
          )}
        </div>

        {onPageChange && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            hasNext={hasNext}
            disabled={loading}
            onPageChange={(p) => onPageChange(p)}
          />
        )}
      </div>
    </div>
  );
};

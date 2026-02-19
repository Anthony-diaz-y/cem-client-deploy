"use client";

import React from "react";
import Link from "next/link";
import { INSTRUCTOR_TEXTS } from "../constants/instructor.constants";

/**
 * InstructorEmptyState - Empty state component for instructor dashboard
 */
const InstructorEmptyState: React.FC = () => {
  return (
    <div className="mt-12 rounded-[2rem] bg-white border border-cem-neutral-gray-100 p-12 py-24 text-center shadow-sm">
      <div className="bg-cem-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg
          className="w-12 h-12 text-cem-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-black text-cem-neutral-gray-900 mb-4 tracking-tight">
        {INSTRUCTOR_TEXTS.courses.emptyState.message}
      </h2>

      <p className="text-cem-neutral-gray-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
        ¡Comienza hoy mismo a compartir tu conocimiento con miles de estudiantes en CEM!
      </p>

      <Link href={INSTRUCTOR_TEXTS.links.addCourse}>
        <div className="inline-flex items-center gap-3 px-10 py-5 bg-cem-primary text-white rounded-2xl font-black text-lg hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 hover:shadow-xl hover:shadow-cem-primary/30 transform hover:-translate-y-1">
          {INSTRUCTOR_TEXTS.courses.emptyState.action}
          <span className="text-2xl leading-none">+</span>
        </div>
      </Link>
    </div>
  );
};

export default InstructorEmptyState;

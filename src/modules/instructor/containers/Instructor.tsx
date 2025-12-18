"use client";

import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import InstructorChart from "../components/InstructorChart";
import InstructorStats from "../components/InstructorStats";
import InstructorCoursesGrid from "../components/InstructorCoursesGrid";
import InstructorLoadingSkeleton from "../components/InstructorLoadingSkeleton";
import InstructorEmptyState from "../components/InstructorEmptyState";
import { useInstructorData } from "../hooks/useInstructorData";
import { useInstructorStats } from "../hooks/useInstructorStats";
import { RootState } from "@shared/store/store";

/**
 * Instructor - Main component for instructor dashboard
 * Orchestrates instructor data and statistics through custom hooks
 * Muestra skeleton solo si la carga toma más de 300ms (evita parpadeo rápido)
 */
const MIN_LOADING_TIME = 300; // Tiempo mínimo en ms antes de mostrar skeleton

export default function Instructor() {
  const { user } = useSelector((state: RootState) => state.profile);
  const { loading, instructorData, courses } = useInstructorData();
  const { totalAmount, totalStudents, totalCourses } = useInstructorStats(
    instructorData,
    courses
  );

  const [showSkeleton, setShowSkeleton] = useState(false);
  const loadingStartTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasEverLoadedRef = useRef(courses.length > 0 || instructorData !== null);

  // Controlar cuándo mostrar skeleton con delay mínimo
  useEffect(() => {
    if (loading && !hasEverLoadedRef.current) {
      // Iniciar timer solo si nunca se han cargado datos
      loadingStartTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        // Solo mostrar skeleton si todavía está cargando después del delay mínimo
        if (loading) {
          setShowSkeleton(true);
        }
      }, MIN_LOADING_TIME);
    } else {
      // Si terminó de cargar o ya hay datos, ocultar skeleton inmediatamente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowSkeleton(false);
      
      if (courses.length > 0 || instructorData) {
        hasEverLoadedRef.current = true;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, courses, instructorData]);

  // Renderizar siempre el contenido, incluso si está vacío inicialmente
  // Esto evita el parpadeo durante navegación
  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">
          Hii {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200 text-center sm:text-left">
          Let&apos;s start something new
        </p>
      </div>

      {/* Mostrar skeleton solo si la carga toma más de 300ms (evita parpadeo rápido) */}
      {showSkeleton ? (
        <InstructorLoadingSkeleton />
      ) : courses.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {courses.length > 0 ? (
              <InstructorChart courses={courses} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}

            <InstructorStats
              totalCourses={totalCourses}
              totalStudents={totalStudents}
              totalAmount={totalAmount}
            />
          </div>

          <InstructorCoursesGrid courses={courses} />
        </div>
      ) : (
        <InstructorEmptyState />
      )}
    </div>
  );
}

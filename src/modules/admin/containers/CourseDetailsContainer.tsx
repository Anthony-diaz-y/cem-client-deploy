"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCourseDetailsAdmin,
  CourseDetailsData,
} from "@shared/services/adminAPI";
import { Loading } from "@shared/components";
import StatisticsCards from "../components/course/StatisticsCards";
import StudentsTable from "../components/course/StudentsTable";
import DiscussionsByLesson from "../components/course/DiscussionsByLesson";
import ReviewsList from "../components/course/ReviewsList";
import { Img } from "@shared/components";
import { FiEdit2, FiArrowLeft } from "react-icons/fi";

interface CourseDetailsContainerProps {
  courseId: string;
  token: string;
}

export default function CourseDetailsContainer({
  courseId,
  token,
}: CourseDetailsContainerProps) {
  const router = useRouter();
  const [data, setData] = useState<CourseDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId || !token) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getCourseDetailsAdmin(courseId, token);
        if (result) {
          setData(result);
        } else {
          setError("No se pudieron cargar los detalles del curso");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los datos",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, token, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl  border border-cem-neutral-gray-100 p-8 text-center">
        <p className="text-cem-neutral-gray-500 text-lg mb-4">
          {error || "No se pudieron cargar los datos del curso"}
        </p>
        <button
          onClick={() => router.push("/dashboard/admin/all-courses")}
          className="px-4 py-2 bg-cem-primary hover:bg-cem-primary-dark text-white rounded-lg transition-all duration-200"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón de regreso */}
      <button
        onClick={() => router.push("/dashboard/admin/all-courses")}
        className="flex items-center gap-2 text-cem-neutral-gray-400 hover:text-cem-primary transition-colors"
      >
        <FiArrowLeft className="text-lg" />
        <span>Volver a Cursos</span>
      </button>

      {/* Header del Curso */}
      <div className=" rounded-xl bg-white p-6 shadow-sm ">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Thumbnail */}
          <div className="w-full md:w-auto flex justify-center md:block">
            <div className="w-full max-w-[268px] aspect-[3/2] rounded-lg overflow-hidden bg-cem-neutral-gray-50 border border-cem-neutral-gray-100 shadow-sm">
              <Img
                src={data.course.thumbnail}
                alt={data.course.courseName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Información del curso */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="w-full">
              <h1 className="text-3xl font- text-[#1E293B] mb-2 truncate">
                {data.course.courseName}
              </h1>
              <p className="text-cem-neutral-gray-500 text-[14px] line-clamp-2">
                {data.course.courseDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px]">
              {/* Instructores */}
              <div className="flex items-center gap-2">
                <span className="text-cem-neutral-gray-400 whitespace-nowrap">
                  Instructor(es):{" "}
                </span>
                <span className="text-cem-neutral-gray-800 font-bold">
                  {(() => {
                    const allInstructors =
                      data.course.instructors &&
                      data.course.instructors.length > 0
                        ? data.course.instructors
                        : [data.course.instructor];
                    return allInstructors.map((i) => i.name).join(" & ");
                  })()}
                </span>
              </div>

              {/* Categorías (Carrera / Sector) con fallback robusto */}
              {(() => {
                const categories =
                  data.course.category && data.course.category.length > 0
                    ? data.course.category
                    : [
                        data.course.career
                          ? { ...data.course.career, type: "career" as const }
                          : null,
                        data.course.sector
                          ? { ...data.course.sector, type: "sector" as const }
                          : null,
                      ].filter(Boolean);

                if (categories.length === 0) return null;

                return (
                  <div className="flex items-center gap-2">
                    <span className="text-cem-neutral-gray-400 whitespace-nowrap">
                      Pertenece a:{" "}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat, idx) => (
                        <div
                          key={cat!.id || idx}
                          className="flex items-center gap-1"
                        >
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight
                              ${
                                cat!.type === "career"
                                  ? "bg-[#FAEBEF] text-[#D81B60]"
                                  : "bg-cem-primary/10 text-cem-primary"
                              }
                            `}
                          >
                            {cat!.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center gap-4">
                {/* Precio */}
                <div className="flex items-center gap-2">
                  <span className="text-cem-neutral-gray-400 whitespace-nowrap">
                    Precio:{" "}
                  </span>
                  <span className="text-cem-primary font-bold">
                    S/{data.course.price.toFixed(2)}
                  </span>
                </div>

                {/* Estado */}
                <div className="flex items-center gap-2">
                  <span className="text-cem-neutral-gray-400 whitespace-nowrap">
                    Estado:{" "}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      data.course.status === "Published"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {data.course.status === "Published"
                      ? "Publicado"
                      : "Borrador"}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón Editar Curso */}
            <div className="pt-2">
              <button
                onClick={() =>
                  router.push(`/dashboard/admin/courses/edit/${data.courseId}`)
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-cem-primary hover:bg-cem-primary-dark text-white rounded-lg transition-all duration-200 font-medium"
              >
                <FiEdit2 className="text-base" />
                Editar Curso
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <StatisticsCards statistics={data.statistics} />

      {/* Lista de Estudiantes Matriculados */}
      <div className="bg-white rounded-xl border border-cem-neutral-gray-100 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1E293B] mb-6">
          Estudiantes Matriculados
        </h2>
        <StudentsTable students={data.enrolledStudents} />
      </div>

      {/* Discusiones por Lección */}
      <div className="bg-white rounded-xl border border-cem-neutral-gray-100 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1E293B] mb-6">
          Discusiones por Lección
        </h2>
        <DiscussionsByLesson
          discussions={data.discussionsBySubSection}
          token={token}
          onUpdate={handleRefresh}
        />
      </div>

      {/* Reseñas del Curso */}
      <div className="bg-white rounded-xl border border-cem-neutral-gray-100 p-6 shadow-sm">
        <ReviewsList
          reviews={data.reviews || []}
          courseId={data.courseId}
          token={token}
          onUpdate={handleRefresh}
        />
      </div>
    </div>
  );
}

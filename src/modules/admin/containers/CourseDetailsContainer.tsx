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
    <div className="space-y-6 xl:pr-20">
      {/* Botón de regreso */}
      <button
        onClick={() => router.push("/dashboard/admin/all-courses")}
        className="flex items-center gap-2 text-cem-neutral-gray-400 hover:text-cem-primary transition-colors"
      >
        <FiArrowLeft className="text-lg" />
        <span>Volver a Cursos</span>
      </button>

      {/* Header del Curso */}
      <div className=" rounded-xl border border-cem-neutral-gray-100 p-6 shadow-sm ">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-[268px] h-[178.67px] rounded-lg overflow-hidden bg-cem-neutral-gray-50 border border-cem-neutral-gray-100 shadow-sm">
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

            <div className="flex flex-wrap items-center gap-4 text-[14px]">
              <div>
                <span className="text-cem-neutral-gray-400">Instructor: </span>
                <span className="text-cem-neutral-gray-800 font-medium">
                  {data.course.instructor.name}
                </span>
              </div>
              {data.course.category && (
                <div>
                  <span className="text-cem-neutral-gray-400">Categoría(s): </span>
                  <span className="text-cem-neutral-gray-800 font-medium">
                    {Array.isArray(data.course.category)
                      ? data.course.category.map((c: any) => c.name).join(", ")
                      : (data.course.category as any)?.name}
                  </span>
                </div>
              )}
              <div>
                <span className="text-cem-neutral-gray-400">Precio: </span>
                <span className="text-cem-primary font-bold">
                  S/{data.course.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cem-neutral-gray-400">Estado: </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${data.course.status === "Published"
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

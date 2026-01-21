"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourseDetailsAdmin, CourseDetailsData } from "@shared/services/adminAPI";
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
          err instanceof Error ? err.message : "Error al cargar los datos"
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
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-8 text-center">
        <p className="text-richblack-300 text-lg mb-4">
          {error || "No se pudieron cargar los datos del curso"}
        </p>
        <button
          onClick={() => router.push("/dashboard/admin/all-courses")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
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
        className="flex items-center gap-2 text-richblack-300 hover:text-richblack-5 transition-colors"
      >
        <FiArrowLeft className="text-lg" />
        <span>Volver a Cursos</span>
      </button>

      {/* Header del Curso */}
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-lg overflow-hidden bg-richblack-900">
              <Img
                src={data.course.thumbnail}
                alt={data.course.courseName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Información del curso */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                {data.course.courseName}
              </h1>
              <p className="text-richblack-300 text-sm line-clamp-2">
                {data.course.courseDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-richblack-400">Instructor: </span>
                <span className="text-richblack-5 font-medium">
                  {data.course.instructor.firstName}{" "}
                  {data.course.instructor.lastName}
                </span>
              </div>
              {data.course.category && (
                <div>
                  <span className="text-richblack-400">Categoría: </span>
                  <span className="text-richblack-5 font-medium">
                    {data.course.category.name}
                  </span>
                </div>
              )}
              <div>
                <span className="text-richblack-400">Precio: </span>
                <span className="text-yellow-50 font-bold">
                  ${data.course.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-richblack-400">Estado: </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    data.course.status === "Published"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
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
                  router.push(
                    `/dashboard/admin/courses/edit/${data.courseId}`
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-blue-500/20"
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
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6">
        <h2 className="text-2xl font-bold text-richblack-5 mb-6">
          Estudiantes Matriculados
        </h2>
        <StudentsTable students={data.enrolledStudents} />
      </div>

      {/* Discusiones por Lección */}
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6">
        <h2 className="text-2xl font-bold text-richblack-5 mb-6">
          Discusiones por Lección
        </h2>
        <DiscussionsByLesson
          discussions={data.discussionsBySubSection}
          token={token}
          onUpdate={handleRefresh}
        />
      </div>

      {/* Reseñas del Curso */}
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6">
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


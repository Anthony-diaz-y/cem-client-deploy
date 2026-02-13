"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";

import { getFullDetailsOfCourse } from "@shared/services/courseDetailsAPI";
import { setCourse, setEditCourse } from "@modules/course/store/courseSlice";
import RenderSteps from "@modules/add-course/components/navigation/RenderSteps";
import { Loading } from "@shared/components";
import { AppDispatch } from "@shared/store/store";
import { Course } from "@modules/course/types";

// Función para normalizar la estructura del curso (subSections -> subSection)
const normalizeCourseStructure = (course: any): Course => {
  if (!course || !course.courseContent) return course;

  const normalizedContent = course.courseContent.map((section: any) => {
    // Si tiene subSections (con S mayúscula), convertir a subSection
    if (section.subSections && Array.isArray(section.subSections)) {
      return {
        ...section,
        subSection: section.subSections,
      };
    }
    // Si no tiene subSection, asegurar que sea un array vacío
    if (!section.subSection) {
      return {
        ...section,
        subSection: [],
      };
    }
    return section;
  });

  return {
    ...course,
    courseContent: normalizedContent,
  };
};

export default function AdminEditCourse() {
  const { courseId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useAppSelector((state) => state.auth);
  const { course } = useAppSelector((state) => state.course);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      if (!courseId || !token) return;

      setLoading(true);
      try {
        const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;
        const result = await getFullDetailsOfCourse(courseIdString, token);
        if (result?.courseDetails) {
          // Normalizar la estructura del curso (subSections -> subSection)
          const normalizedCourse = normalizeCourseStructure(result.courseDetails);
          dispatch(setEditCourse(true));
          dispatch(setCourse(normalizedCourse));
        }
      } catch (error) {
        // Error manejado por el servicio
      } finally {
        setLoading(false);
      }
    };

    fetchFullCourseDetails();
  }, [courseId, token, dispatch]);

  // Loading
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col xl:flex-row w-full items-start gap-y-10 xl:gap-y-0 xl:gap-x-10">
      <div className="flex flex-1 flex-col w-full">
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-y-4">
          <h1 className="text-3xl font-medium text-cem-neutral-gray-900 font-boogaloo text-center md:text-left">
            Editar Curso: {course ? (course as Course).courseName : "Cargando..."}
          </h1>
          <button
            onClick={() => router.push("/dashboard/admin/all-courses")}
            className="px-6 py-2.5 bg-cem-neutral-gray-100 text-cem-neutral-gray-700 rounded-xl hover:bg-cem-neutral-gray-200 transition-all font-semibold shadow-sm border border-cem-neutral-gray-200"
          >
            Volver a Cursos
          </button>
        </div>

        <div className="flex-1 w-full mx-auto max-w-[800px] xl:max-w-none">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-24 hidden xl:block w-full max-w-[400px] flex-shrink-0 rounded-2xl border-[1px] border-cem-neutral-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-x-2 mb-6">
          <span className="text-2xl">⚡</span>
          <p className="text-xl text-cem-neutral-gray-900 font-semibold font-boogaloo">Consejos para Editar Cursos</p>
        </div>

        <ul className="ml-5 list-disc space-y-4 text-sm text-cem-neutral-gray-600">
          <li>Puedes editar toda la información del curso.</li>
          <li>Puedes agregar, editar o eliminar secciones.</li>
          <li>Puedes agregar, editar o eliminar videos/lecturas.</li>
          <li>Los cambios se guardan individualmente.</li>
          <li>Recuerda guardar los cambios antes de salir.</li>
        </ul>
      </div>
    </div>
  );
}


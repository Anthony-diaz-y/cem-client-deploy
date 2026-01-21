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
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-medium text-richblack-5 font-boogaloo">
            Editar Curso: {course ? (course as Course).courseName : "Cargando..."}
          </h1>
          <button
            onClick={() => router.push("/dashboard/admin/all-courses")}
            className="px-4 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors font-medium"
          >
            Volver a Cursos
          </button>
        </div>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="mb-8 text-lg text-richblack-5">⚡ Consejos para Editar Cursos</p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
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


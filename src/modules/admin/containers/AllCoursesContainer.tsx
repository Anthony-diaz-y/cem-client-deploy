"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";
import AllCoursesTable from "../components/course/AllCoursesTable";
import { getAllCoursesAdmin, AdminCourse } from "@shared/services/adminAPI";
import { Loading } from "@shared/components";

export default function AllCoursesContainer() {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllCoursesAdmin(token);
      setCourses(data || []);
    } catch {
      // Error manejado por el servicio
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  // Solo mostrar loading durante la carga inicial

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-richblack-5">
          Todos los Cursos
        </h1>
        <p className="text-richblack-400">
          Gestiona todos los cursos del sistema, tanto publicados como en borrador
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => router.push("/dashboard/add-course")}
            className="flex items-center gap-x-2 rounded-lg bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
          >
            <span className="text-lg">+</span> Crear Curso
          </button>
        </div>
      </div>

      <AllCoursesTable
        courses={courses}
        token={token}
        onUpdate={fetchCourses}
        onEdit={() => {}} // No se usa, la navegación se hace directamente en AllCoursesTable
      />
    </div>
  );
}


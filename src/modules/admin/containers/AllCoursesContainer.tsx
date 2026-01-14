"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";
import AllCoursesTable from "../components/course/AllCoursesTable";
import CreateCategoryModal from "../components/category/CreateCategoryModal";
import { getAllCoursesAdmin, AdminCourse } from "@shared/services/adminAPI";
import Loading from "@shared/components/Loading";

export default function AllCoursesContainer() {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [categoryRefreshKey, setCategoryRefreshKey] = useState(0);

  const fetchCourses = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllCoursesAdmin(token);
      setCourses(data || []);
    } catch (error) {
      // Error manejado por el servicio
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  // Solo mostrar loading durante la carga inicial
  // Una vez que la carga termine (incluso si no hay cursos), mostrar el contenido
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
          <button
            onClick={() => setIsCreateCategoryModalOpen(true)}
            className="flex items-center gap-x-2 rounded-lg bg-richblack-700 px-5 py-2.5 font-semibold text-richblack-5 transition-all duration-200 hover:bg-richblack-600 hover:scale-105 hover:shadow-lg"
          >
            <span className="text-lg">+</span> Crear Categoría
          </button>
        </div>
      </div>

      <AllCoursesTable
        courses={courses}
        token={token}
        onUpdate={fetchCourses}
        onEdit={() => {}} // No se usa, la navegación se hace directamente en AllCoursesTable
        onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
        categoryRefreshKey={categoryRefreshKey}
      />

      {isCreateCategoryModalOpen && token && (
        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={() => {
            fetchCourses();
            setCategoryRefreshKey(prev => prev + 1);
          }}
          token={token}
        />
      )}
    </div>
  );
}


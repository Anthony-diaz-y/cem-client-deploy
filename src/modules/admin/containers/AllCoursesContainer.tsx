"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@shared/store/hooks";
import AllCoursesTable from "../components/AllCoursesTable";
import CreateCategoryModal from "../components/CreateCategoryModal";
import { getAllCoursesAdmin, AdminCourse } from "@shared/services/adminAPI";
import Loading from "@shared/components/Loading";

export default function AllCoursesContainer() {
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
      console.error("Error fetching all courses:", error);
      setCourses([]); // Asegurar que sea un array vacío en caso de error
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
      <div>
        <h1 className="text-3xl font-bold text-richblack-5 mb-2">
          Todos los Cursos
        </h1>
        <p className="text-richblack-400">
          Gestiona todos los cursos del sistema, tanto publicados como en borrador
        </p>
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


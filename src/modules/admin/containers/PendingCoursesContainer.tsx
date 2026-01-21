"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@shared/store/hooks";
import PendingCoursesTable from "../components/course/PendingCoursesTable";
import EditCourseModal from "../components/course/EditCourseModal";
import { getPendingCourses, AdminCourse } from "@shared/services/adminAPI";
import { Loading } from "@shared/components";

export default function PendingCoursesContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCourses = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getPendingCourses(token);
      setCourses(data);
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const handleEdit = (course: AdminCourse) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchCourses();
  };

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-richblack-5 mb-2">
          Gestión de Cursos
        </h1>
        <p className="text-richblack-400">
          Revisa y gestiona los cursos pendientes de publicación creados por instructores
        </p>
      </div>

      <PendingCoursesTable
        courses={courses}
        token={token}
        onUpdate={fetchCourses}
        onEdit={handleEdit}
      />

      {isEditModalOpen && selectedCourse && (
        <EditCourseModal
          course={selectedCourse}
          token={token}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCourse(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}


"use client";

import React, { useState, useMemo } from "react";
import { EnrolledStudent } from "@shared/services/adminAPI";
import { Img } from "@shared/components";
import { FiSearch } from "react-icons/fi";

interface StudentsTableProps {
  students: EnrolledStudent[];
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const [studentFilter, setStudentFilter] = useState<
    "all" | "completed" | "in-progress" | "not-started"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Filtro por estado
      if (studentFilter === "completed" && !student.progress.isCompleted)
        return false;
      if (
        studentFilter === "in-progress" &&
        (student.progress.isCompleted ||
          student.progress.completedSubSections === 0)
      )
        return false;
      if (
        studentFilter === "not-started" &&
        student.progress.completedSubSections > 0
      )
        return false;

      // Búsqueda por nombre/email
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return (
          fullName.includes(query) || student.email.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [students, studentFilter, searchQuery]);

  const getStatusBadge = (student: EnrolledStudent) => {
    if (student.progress.isCompleted) {
      return (
        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
          Completado
        </span>
      );
    }
    if (student.progress.completedSubSections > 0) {
      return (
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
          En Progreso
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">
        No Iniciado
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Selector de filtro */}
        <select
          value={studentFilter}
          onChange={(e) =>
            setStudentFilter(
              e.target.value as
                | "all"
                | "completed"
                | "in-progress"
                | "not-started"
            )
          }
          className="px-4 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="completed">Completados</option>
          <option value="in-progress">En Progreso</option>
          <option value="not-started">No Iniciados</option>
        </select>

        {/* Búsqueda */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-400 text-lg" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contador */}
        <div className="text-sm text-richblack-400 flex items-center">
          {filteredStudents.length} de {students.length} estudiantes
        </div>
      </div>

      {/* Tabla */}
      {filteredStudents.length === 0 ? (
        <div className="bg-richblack-900/50 rounded-lg p-8 text-center">
          <p className="text-richblack-400">
            {students.length === 0
              ? "No hay estudiantes matriculados en este curso"
              : "No se encontraron estudiantes con los filtros seleccionados"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-richblack-700">
            <thead className="bg-richblack-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                  Inscrito
                </th>
              </tr>
            </thead>
            <tbody className="bg-richblack-800 divide-y divide-richblack-700">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-richblack-900/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-richblack-700 flex-shrink-0">
                        <Img
                          src={student.image}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-richblack-5">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-richblack-300">
                      {student.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-richblack-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${student.progress.progressPercentage}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-richblack-5">
                          {student.progress.progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-richblack-400">
                        {student.progress.completedSubSections} /{" "}
                        {student.progress.totalSubSections} lecciones
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-richblack-300">
                      {formatDate(student.enrolledAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


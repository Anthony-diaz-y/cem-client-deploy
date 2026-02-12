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
        const fullName = `${student.name}`.toLowerCase();
        return (
          fullName.includes(query) ||
          student.email.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [students, studentFilter, searchQuery]);

  const getStatusBadge = (student: EnrolledStudent) => {
    if (student.progress.isCompleted) {
      return (
        <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">
          Completado
        </span>
      );
    }
    if (student.progress.completedSubSections > 0) {
      return (
        <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-bold">
          En Progreso
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-cem-neutral-gray-100 text-cem-neutral-gray-500 rounded-full text-xs font-bold">
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
              | "not-started",
            )
          }
          className="px-4 py-2 bg-white border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cem-primary transition-all cursor-pointer shadow-sm"
        >
          <option value="all">Todos</option>
          <option value="completed">Completados</option>
          <option value="in-progress">En Progreso</option>
          <option value="not-started">No Iniciados</option>
        </select>

        {/* Búsqueda */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cem-neutral-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-2 focus:ring-cem-primary transition-all shadow-sm"
          />
        </div>

        {/* Contador */}
        <div className="text-sm font-bold text-cem-neutral-gray-500 flex items-center">
          {filteredStudents.length} de {students.length} estudiantes
        </div>
      </div>

      {/* Tabla */}
      {filteredStudents.length === 0 ? (
        <div className="bg-cem-neutral-gray-50 rounded-lg p-8 text-center border border-cem-neutral-gray-100">
          <p className="text-cem-neutral-gray-500 font-bold">
            {students.length === 0
              ? "No hay estudiantes matriculados en este curso"
              : "No se encontraron estudiantes con los filtros seleccionados"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-cem-neutral-gray-100 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-cem-neutral-gray-100">
            <thead className="bg-cem-neutral-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-cem-neutral-gray-400 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-black text-cem-neutral-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-black text-cem-neutral-gray-400 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-black text-cem-neutral-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-black text-cem-neutral-gray-400 uppercase tracking-wider">
                  Inscrito
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-cem-neutral-gray-100">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-cem-neutral-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-cem-neutral-gray-100 flex-shrink-0 border border-cem-neutral-gray-100">
                        <Img
                          src={student.image}
                          alt={`${student.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-bold text-[#1E293B]">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-cem-neutral-gray-500">
                      {student.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-cem-neutral-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                          <div
                            className="bg-cem-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${student.progress.progressPercentage}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-black text-cem-primary">
                          {student.progress.progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-tight">
                        {student.progress.completedSubSections} /{" "}
                        {student.progress.totalSubSections} lecciones
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-cem-neutral-gray-400">
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

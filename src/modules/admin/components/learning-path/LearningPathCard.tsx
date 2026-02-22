import React from "react";
import {
  FiChevronDown,
  FiBook,
  FiEdit2,
  FiTrash2,
  FiVideo,
} from "react-icons/fi";
import { LearningPath } from "@shared/services/admin/types";

interface LearningPathCardProps {
  learningPath: LearningPath;
  onToggle: (id: string) => void;
  onEdit: (lp: LearningPath) => void;
  onDelete: (lp: LearningPath) => void;
  isExpanded: boolean;
}

export default function LearningPathCard({
  learningPath,
  onToggle,
  onEdit,
  onDelete,
  isExpanded,
}: LearningPathCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-cem-neutral-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div
        className="p-6 flex items-center justify-between cursor-pointer select-none"
        onClick={() => onToggle(learningPath.id)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cem-primary/10 flex items-center justify-center text-cem-primary text-xl">
            {learningPath.icon ? (
              <div
                className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current"
                dangerouslySetInnerHTML={{ __html: learningPath.icon }}
              />
            ) : (
              <FiBook />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-cem-neutral-gray-900 leading-tight">
              {learningPath.title}
            </h3>
            <p className="text-sm text-cem-neutral-gray-500 mt-1">
              {learningPath.courses?.length || 0} cursos en esta ruta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(learningPath);
            }}
            className="p-2 hover:bg-cem-primary/10 rounded-lg text-cem-neutral-gray-500 hover:text-cem-primary transition-colors"
            title="Editar ruta"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(learningPath);
            }}
            className="p-2 hover:bg-pink-100 rounded-lg text-cem-neutral-gray-500 hover:text-pink-500 transition-colors"
            title="Eliminar ruta"
          >
            <FiTrash2 size={18} />
          </button>
          <div
            className={`text-cem-neutral-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <FiChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded
            ? "max-h-[1000px] border-t border-cem-neutral-gray-50"
            : "max-h-0"
        }`}
      >
        <div className="p-6 bg-cem-neutral-gray-50/30">
          <div className="mb-6">
            <h4 className="text-xs font-bold text-cem-neutral-gray-400 uppercase tracking-wider mb-2">
              Descripción
            </h4>
            <p className="text-sm text-cem-neutral-gray-600">
              {learningPath.description || "Sin descripción proporcionada."}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-cem-neutral-gray-400 uppercase tracking-wider mb-4">
              Cursos en esta ruta
            </h4>

            {learningPath.courses && learningPath.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningPath.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cem-neutral-gray-100 shadow-sm"
                  >
                    <div className="p-2 bg-cem-neutral-gray-50 rounded-lg text-cem-neutral-gray-400">
                      <FiVideo size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-cem-neutral-gray-900 truncate">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-cem-neutral-gray-500 truncate">
                        {course.instructor?.name || "Instructor desconocido"}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        course.status === "Published"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {course.status === "Published" ? "Publicado" : "Borrador"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-cem-neutral-gray-400 italic text-sm">
                Esta ruta aún no tiene cursos asociados.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

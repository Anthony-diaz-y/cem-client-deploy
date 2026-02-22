import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminCourse, CourseCategory } from "@shared/services/adminAPI";
import { COURSE_STATUS } from "@shared/utils/constants";
import { Img } from "@shared/components";
import {
  FiEdit3,
  FiTrash2,
  FiEye,
  FiMoreHorizontal,
  FiRotateCcw,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

interface CourseCardProps {
  course: AdminCourse;
  onPublishClick: (course: AdminCourse) => void;
  onUnpublishClick: (course: AdminCourse) => void;
  onDeleteClick: (course: AdminCourse) => void;
}

export default function CourseCard({
  course,
  onPublishClick,
  onUnpublishClick,
  onDeleteClick,
}: CourseCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPublished = course.status === COURSE_STATUS.PUBLISHED;

  return (
    <div className="bg-white rounded-[24px] border border-cem-neutral-gray-100 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-500 group flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      {/* Thumbnail con overlay */}
      <div className="relative w-full h-[220px] overflow-hidden">
        {course.thumbnail ? (
          <Img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-cem-neutral-gray-50 flex items-center justify-center text-cem-neutral-gray-400">
            Sin imagen
          </div>
        )}

        {/* Badge de estado flotante */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg backdrop-blur-md ${
              isPublished
                ? "bg-[#22C55E] text-white"
                : "bg-cem-neutral-gray-700/80 text-white"
            }`}
          >
            {isPublished ? (
              <FiCheckCircle className="text-sm" />
            ) : (
              <FiClock className="text-sm" />
            )}
            {isPublished ? "Publicado" : "Borrador"}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        {/* Categorías */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.isArray(course.category) ? (
            course.category.map((cat: CourseCategory, index) => (
              <span
                key={cat.id || index}
                className={`inline-flex px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider w-fit ${
                  index % 2 === 0
                    ? "bg-[#EEF2FF] text-[#4F46E5]"
                    : "bg-[#F0FDF4] text-[#16A34A]"
                }`}
              >
                {cat.name}
              </span>
            ))
          ) : course.category ? (
            <span className="inline-flex px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider w-fit bg-[#EEF2FF] text-[#4F46E5]">
              {(course.category as CourseCategory).name}
            </span>
          ) : null}
        </div>

        {/* Título - Altura fija para mantener la alineación de lo que sigue */}
        <div className="min-h-[56px] flex items-start mb-4">
          <h3 className="text-xl font-bold text-[#1E293B] line-clamp-2 leading-tight">
            {course.courseName}
          </h3>
        </div>

        {/* Info flexible con empuje hacia el fondo */}
        <div className="flex flex-col flex-1">
          {/* Instructores */}
          {(() => {
            const allInstructors =
              course.instructors && course.instructors.length > 0
                ? course.instructors
                : course.instructor
                  ? [course.instructor]
                  : [];

            const mainInstructors = allInstructors.slice(0, 3);
            const instructorNames = allInstructors
              .map((i) => i.name)
              .join(" & ");

            return (
              <div className="flex items-center gap-3 h-12 mb-4">
                <div className="flex-shrink-0">
                  <div className="flex -space-x-3 overflow-hidden">
                    {mainInstructors.map((inst, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-cem-teal-100 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-sm ring-1 ring-cem-neutral-gray-100"
                      >
                        {inst.image ? (
                          <Img
                            src={inst.image}
                            alt={inst.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#3B4CB8] flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                            {inst.name?.[0] || "?"}
                          </div>
                        )}
                      </div>
                    ))}
                    {allInstructors.length > 3 && (
                      <div className="w-10 h-10 rounded-full bg-cem-neutral-gray-100 flex items-center justify-center border-2 border-white shadow-sm text-[10px] font-bold text-cem-neutral-gray-600">
                        +{allInstructors.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pl-1">
                  <p className="text-sm font-bold text-[#1E293B] line-clamp-1 leading-tight">
                    {instructorNames || "Instructor"}
                  </p>
                  <p className="text-[11px] text-cem-neutral-gray-400 truncate mt-0.5">
                    {allInstructors.length > 1
                      ? "Co-autores"
                      : allInstructors[0]?.email || "Sin email"}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="mt-auto space-y-4">
            {/* Precio */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#00849c]">
                S/{course.price.toFixed(2)}
              </span>
            </div>

            {/* Separador e Info Alumnos */}
            <div className="pt-4 border-t border-cem-neutral-gray-100 flex items-center justify-between">
              <p className="text-sm font-medium text-cem-neutral-gray-500">
                <span className="font-bold text-cem-neutral-gray-900">
                  {course.totalStudentsEnrolled || 0}
                </span>{" "}
                Estudiantes
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push(`/dashboard/admin/courses/${course.id}`)}
            className="flex-1 h-11 bg-cem-primary hover:bg-cem-primary-dark text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cem-primary/20 active:scale-95"
          >
            <FiEye className="text-lg" />
            Ver detalles
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isMenuOpen
                  ? "bg-cem-primary text-white shadow-lg"
                  : "bg-[#DCEEEF] text-cem-primary hover:bg-[#D5E8E9]"
              }`}
            >
              <FiMoreHorizontal className="text-xl" />
            </button>

            {/* Menú Dropdown */}
            {isMenuOpen && (
              <div className="absolute bottom-14 right-0 w-48 bg-white border border-cem-neutral-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-fadeInUp">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push(`/dashboard/admin/courses/edit/${course.id}`);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-cem-neutral-gray-700 hover:bg-cem-neutral-gray-50 hover:text-cem-primary transition-all"
                >
                  <FiEdit3 className="text-lg" />
                  Editar
                </button>

                {isPublished ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onUnpublishClick(course);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-all"
                  >
                    <FiRotateCcw className="text-lg" />
                    Despublicar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onPublishClick(course);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-all"
                  >
                    <FiCheckCircle className="text-lg" />
                    Publicar
                  </button>
                )}

                <div className="h-px bg-cem-neutral-gray-100 mx-2 my-1" />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteClick(course);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                >
                  <FiTrash2 className="text-lg" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

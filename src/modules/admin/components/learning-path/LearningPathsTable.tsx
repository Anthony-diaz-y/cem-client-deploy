import React, { useState } from "react";
import { LearningPath } from "@shared/services/admin/types";
import { FiSearch, FiFrown } from "react-icons/fi";
import LearningPathCard from "./LearningPathCard";

interface LearningPathsTableProps {
  learningPaths: LearningPath[];
  onUpdate: () => void;
  onEdit: (lp: LearningPath) => void;
  onDelete: (lp: LearningPath) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function LearningPathsTable({
  learningPaths,
  onUpdate,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
}: LearningPathsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-8 border border-cem-neutral-gray-100 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <label className="text-[13px] font-bold text-cem-neutral-gray-700 ml-1 block">
            Buscar ruta de aprendizaje
          </label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cem-neutral-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Nombre de la ruta o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-2xl text-sm text-cem-neutral-gray-900 focus:bg-white focus:border-cem-primary transition-all outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {learningPaths.length > 0 ? (
          learningPaths.map((lp) => (
            <LearningPathCard
              key={lp.id}
              learningPath={lp}
              onToggle={handleToggle}
              isExpanded={expandedId === lp.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="bg-white rounded-3xl p-16 border border-cem-neutral-gray-100 text-center shadow-sm">
            <div className="bg-cem-neutral-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFrown className="text-4xl text-cem-neutral-gray-300" />
            </div>
            <p className="text-cem-neutral-gray-800 text-2xl font-bold">
              No se encontraron rutas
            </p>
            <p className="text-cem-neutral-gray-500 mt-2 max-w-md mx-auto">
              {searchTerm
                ? `No hay resultados para "${searchTerm}". Prueba con otros términos.`
                : "Todavía no has creado ninguna ruta de aprendizaje."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

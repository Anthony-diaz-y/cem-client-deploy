"use client";

import { useState, useMemo } from "react";
import { useAppSelector } from "@shared/store/hooks";
import { Loading } from "@shared/components";
import { ActionButton } from "../components/shared/ActionButton";
import { useLearningPaths } from "../hooks/learning-path/useLearningPaths";
import LearningPathsTable from "@modules/admin/components/learning-path/LearningPathsTable";
import CreateLearningPathModal from "@modules/admin/components/learning-path/CreateLearningPathModal";
import EditLearningPathModal from "@modules/admin/components/learning-path/EditLearningPathModal";
import DeleteLearningPathModal from "@modules/admin/components/learning-path/DeleteLearningPathModal";
import { LearningPath } from "@shared/services/admin/types";

export default function LearningPathsContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const { learningPaths, loading, refreshLearningPaths } =
    useLearningPaths(token);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    lp: LearningPath | null;
  }>({
    isOpen: false,
    lp: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    lp: LearningPath | null;
  }>({
    isOpen: false,
    lp: null,
  });

  const filteredPaths = useMemo(() => {
    if (!searchTerm) return learningPaths;
    return learningPaths.filter(
      (lp) =>
        lp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lp.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [learningPaths, searchTerm]);

  if (!token) {
    return (
      <div className="text-center py-20 text-cem-neutral-gray-500">
        Sesión expirada. Por favor, vuelve a ingresar.
      </div>
    );
  }

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-cem-neutral-gray-900 tracking-tight">
            Rutas de Aprendizaje
          </h1>
          <p className="text-cem-neutral-gray-500 text-lg max-w-2xl">
            Crea trayectorias guiadas agrupando cursos relacionados para ofrecer
            una experiencia educativa estructurada.
          </p>
        </div>
        <div className="flex-shrink-0">
          <ActionButton
            label="Nueva Ruta"
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>

      <LearningPathsTable
        learningPaths={filteredPaths}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onUpdate={refreshLearningPaths}
        onEdit={(lp) => setEditModal({ isOpen: true, lp })}
        onDelete={(lp) => setDeleteModal({ isOpen: true, lp })}
      />

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateLearningPathModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refreshLearningPaths}
          token={token}
        />
      )}

      {editModal.isOpen && editModal.lp && (
        <EditLearningPathModal
          isOpen={editModal.isOpen}
          learningPath={editModal.lp}
          onClose={() => setEditModal({ isOpen: false, lp: null })}
          onSuccess={refreshLearningPaths}
          token={token}
        />
      )}

      {deleteModal.isOpen && deleteModal.lp && (
        <DeleteLearningPathModal
          isOpen={deleteModal.isOpen}
          learningPath={deleteModal.lp}
          onClose={() => setDeleteModal({ isOpen: false, lp: null })}
          onSuccess={refreshLearningPaths}
          token={token}
        />
      )}
    </div>
  );
}

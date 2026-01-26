"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { RootState } from "@shared/store/store";
import { SubsectionDiscussion } from "../../types";
import { getDiscussions } from "../../services/discussionAPI";
import { setDiscussionSidebarOpen, setCourseViewSidebar } from "@modules/dashboard/store/sidebarSlice";
import DiscussionItem from "./DiscussionItem";
import DiscussionDetail from "./DiscussionDetail";
import CreateDiscussionForm from "./CreateDiscussionForm";
import { VIEW_COURSE_TEXTS } from "../../constants/viewCourse.constants";

interface DiscussionSidebarProps {
  subSectionId: string;
}

/**
 * Sidebar principal para las discusiones de una subsección
 * Ocupa espacio real en el layout
 */
const DiscussionSidebar: React.FC<DiscussionSidebarProps> = ({
  subSectionId,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.profile);
  const { discussionSidebarOpen } = useSelector((state: RootState) => state.sidebar);
  const [discussions, setDiscussions] = useState<SubsectionDiscussion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<SubsectionDiscussion | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Cargar discusiones
  const loadDiscussions = async () => {
    if (!subSectionId) return;
    setLoading(true);
    try {
      const data = await getDiscussions(subSectionId);
      setDiscussions(data);
    } catch (error) {
      console.error(VIEW_COURSE_TEXTS.discussions.errors.loadDiscussions, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (discussionSidebarOpen && subSectionId) {
      loadDiscussions();
      setSelectedDiscussion(null);
      setShowCreateForm(false);
    }
  }, [discussionSidebarOpen, subSectionId]);

  const handleDiscussionClick = (discussion: SubsectionDiscussion) => {
    setSelectedDiscussion(discussion);
    setShowCreateForm(false);
  };

  const handleBackToList = async () => {
    setSelectedDiscussion(null);
    setShowCreateForm(false);
    await loadDiscussions();
  };

  const handleDiscussionUpdate = async (updatedDiscussions?: SubsectionDiscussion[]) => {
    if (updatedDiscussions) {
      // Actualizar con la lista recibida del backend
      setDiscussions(updatedDiscussions);
      // Si la discusión eliminada estaba seleccionada, volver a la lista
      if (selectedDiscussion) {
        setSelectedDiscussion(null);
      }
    } else {
      // Si no se proporciona lista, recargar desde el servidor
      await loadDiscussions();
    }
  };

  const handleCreateClick = () => {
    setShowCreateForm(true);
    setSelectedDiscussion(null);
  };

  const handleClose = () => {
    dispatch(setDiscussionSidebarOpen(false));
    // Abrir el sidebar de contenido cuando se cierra el de discusiones
    dispatch(setCourseViewSidebar(true));
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[400px] flex-shrink-0 flex-col border-l border-richblack-700 bg-richblack-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-richblack-700 bg-richblack-800 flex-shrink-0">
        <h2 className="text-lg font-semibold text-richblack-5">
          {selectedDiscussion || showCreateForm
            ? selectedDiscussion
              ? VIEW_COURSE_TEXTS.discussions.sidebar.discussion
              : VIEW_COURSE_TEXTS.discussions.sidebar.createNew
            : VIEW_COURSE_TEXTS.discussions.sidebar.discussions(discussions.length)}
        </h2>
        <button
          onClick={handleClose}
          className="text-richblack-400 hover:text-richblack-100 transition-colors duration-200 p-1.5 rounded hover:bg-richblack-700"
          aria-label={VIEW_COURSE_TEXTS.discussions.sidebar.close}
        >
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {selectedDiscussion ? (
          <DiscussionDetail
            discussion={selectedDiscussion}
            currentUserId={(user?._id || user?.id) as string || ""}
            onBack={handleBackToList}
            onUpdate={() => handleDiscussionUpdate()}
            onDiscussionUpdate={(updated) => {
              setSelectedDiscussion(updated);
            }}
            onDeleteSuccess={handleDiscussionUpdate}
          />
        ) : showCreateForm ? (
          <CreateDiscussionForm
            subSectionId={subSectionId}
            onCancel={handleBackToList}
            onSuccess={handleBackToList}
          />
        ) : (
          <div className="p-4">
            {/* Botón Crear Nueva Pregunta */}
            <button
              onClick={handleCreateClick}
              className="w-full mb-4 px-4 py-3 bg-richblack-700 hover:bg-richblack-600 text-richblack-100 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {VIEW_COURSE_TEXTS.discussions.sidebar.createPost}
            </button>

            {/* Lista de discusiones */}
            {loading ? (
              <div className="text-center py-8 text-richblack-400">
                {VIEW_COURSE_TEXTS.discussions.sidebar.loading}
              </div>
            ) : discussions.length === 0 ? (
              <div className="text-center py-8 text-richblack-400">
                {VIEW_COURSE_TEXTS.discussions.sidebar.empty}
              </div>
            ) : (
              <div className="space-y-3">
                {discussions.map((discussion) => (
                  <DiscussionItem
                    key={discussion.id}
                    discussion={discussion}
                    onDiscussionClick={handleDiscussionClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionSidebar;

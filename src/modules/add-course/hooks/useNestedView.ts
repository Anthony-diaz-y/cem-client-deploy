// Hook para manejar el estado y lógica de NestedView
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { Course, SubSection } from "@modules/course/types";
import { type ConfirmationModalData } from "@shared/components";
import { useDragAndDrop } from "./useDragAndDrop";
import { useNestedViewActions } from "./useNestedViewActions";

export interface UseNestedViewReturn {
  course: Course | null;
  addSubSection: string | null;
  viewSubSection: SubSection | null;
  editSubSection: (SubSection & { sectionId: string }) | null;
  editQuiz: (SubSection & { sectionId: string }) | null;
  confirmationModal: ConfirmationModalData | null;
  wasJustDragged: boolean;
  draggedItem: ReturnType<typeof useDragAndDrop>["draggedItem"];
  dragOverSection: ReturnType<typeof useDragAndDrop>["dragOverSection"];
  showMoveWarning: ReturnType<typeof useDragAndDrop>["showMoveWarning"];
  pendingMove: ReturnType<typeof useDragAndDrop>["pendingMove"];
  setAddSubsection: React.Dispatch<React.SetStateAction<string | null>>;
  setViewSubSection: React.Dispatch<React.SetStateAction<SubSection | null>>;
  setEditSubSection: React.Dispatch<React.SetStateAction<(SubSection & { sectionId: string }) | null>>;
  setEditQuiz: React.Dispatch<React.SetStateAction<(SubSection & { sectionId: string }) | null>>;
  setConfirmationModal: React.Dispatch<React.SetStateAction<ConfirmationModalData | null>>;
  setWasJustDragged: React.Dispatch<React.SetStateAction<boolean>>;
  handleSectionDragStart: (e: React.DragEvent, sectionId: string) => void;
  handleLectureDragStart: (e: React.DragEvent, sectionId: string, subSectionId: string) => void;
  handleLectureDragEnd: () => void;
  handleSectionDragOver: (e: React.DragEvent, sectionId: string) => void;
  handleSectionDrop: (e: React.DragEvent, sectionId: string) => void;
  handleLectureDragOver: (e: React.DragEvent, sectionId: string) => void;
  handleLectureDrop: (e: React.DragEvent, sectionId: string, subSectionIndex?: number) => void;
  handleDeleteSectionWithModal: (sectionId: string) => Promise<void>;
  handleDeleteLectureWithModal: (subSectionId: string, sectionId: string) => Promise<void>;
  handleDragEnd: () => void;
  confirmMoveLecture: () => void;
  cancelMoveLecture: () => void;
}

export function useNestedView(): UseNestedViewReturn {
  const { course } = useSelector((state: RootState) => state.course);

  const [addSubSection, setAddSubsection] = useState<string | null>(null);
  const [viewSubSection, setViewSubSection] = useState<SubSection | null>(null);
  const [editSubSection, setEditSubSection] = useState<
    (SubSection & { sectionId: string }) | null
  >(null);
  const [editQuiz, setEditQuiz] = useState<
    (SubSection & { sectionId: string }) | null
  >(null);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [wasJustDragged, setWasJustDragged] = useState(false);

  const {
    draggedItem,
    dragOverSection,
    showMoveWarning,
    pendingMove,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    confirmMoveLecture,
    cancelMoveLecture,
  } = useDragAndDrop();

  const { handleDeleteSection, handleDeleteSubSection } = useNestedViewActions();

  const handleSectionDragStart = (e: React.DragEvent, sectionId: string) => {
    handleDragStart("section", sectionId);
  };

  const handleLectureDragStart = (e: React.DragEvent, sectionId: string, subSectionId: string) => {
    setWasJustDragged(true);
    handleDragStart("lecture", sectionId, subSectionId);
  };

  const handleLectureDragEnd = () => {
    handleDragEnd();
  };

  const handleSectionDragOver = (e: React.DragEvent, sectionId: string) => {
    handleDragOver(e, sectionId);
  };

  const handleSectionDrop = (e: React.DragEvent, sectionId: string) => {
    handleDrop(e, sectionId);
  };

  const handleLectureDragOver = (e: React.DragEvent, sectionId: string) => {
    handleDragOver(e, sectionId);
  };

  const handleLectureDrop = (e: React.DragEvent, sectionId: string, subSectionIndex?: number) => {
    handleDrop(e, sectionId, subSectionIndex);
  };

  const handleDeleteSectionWithModal = async (sectionId: string) => {
    await handleDeleteSection(sectionId);
    setConfirmationModal(null);
  };

  const handleDeleteLectureWithModal = async (subSectionId: string, sectionId: string) => {
    await handleDeleteSubSection(subSectionId, sectionId);
    setConfirmationModal(null);
  };

  const courseData = course as Course | null;

  return {
    course: courseData,
    addSubSection,
    viewSubSection,
    editSubSection,
    confirmationModal,
    wasJustDragged,
    draggedItem,
    dragOverSection,
    showMoveWarning,
    pendingMove,
    setAddSubsection,
    setViewSubSection,
    setEditSubSection,
    editQuiz,
    setEditQuiz,
    setConfirmationModal,
    setWasJustDragged,
    handleSectionDragStart,
    handleLectureDragStart,
    handleLectureDragEnd,
    handleSectionDragOver,
    handleSectionDrop,
    handleLectureDragOver,
    handleLectureDrop,
    handleDeleteSectionWithModal,
    handleDeleteLectureWithModal,
    handleDragEnd,
    confirmMoveLecture,
    cancelMoveLecture,
  };
}



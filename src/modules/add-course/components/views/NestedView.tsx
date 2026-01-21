import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { Course, Section, SubSection } from "@modules/course/types";
import { type ConfirmationModalData } from "@shared/components";
import { NestedViewProps } from "../../types/index";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useNestedViewActions } from "./hooks/useNestedViewActions";
import SectionItem from "./components/SectionItem";
import ModalsContainer from "./components/ModalsContainer";

// Vista anidada de secciones y subsecciones del curso
export default function NestedView({
  handleChangeEditSectionName,
}: NestedViewProps) {
  const { course } = useSelector((state: RootState) => state.course);
  
  const [addSubSection, setAddSubsection] = useState<string | null>(null);
  const [viewSubSection, setViewSubSection] = useState<SubSection | null>(null);
  const [editSubSection, setEditSubSection] = useState<
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

  if (!course) return null;
  const courseData = course as Course;

  return (
    <>
      <div
        className="rounded-2xl bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {courseData.courseContent.map((section: Section, sectionIndex: number) => {
          const sectionId = (section as { id?: string })?.id || section?._id;
          
          if (!sectionId || typeof sectionId !== 'string') {
            return null;
          }
          
          const isSectionDragged =
            draggedItem?.type === "section" &&
            draggedItem?.sectionId === sectionId;
          const isSectionDragOver =
            draggedItem?.type === "section" &&
            dragOverSection === sectionId &&
            draggedItem?.sectionId !== sectionId;

          return (
            <SectionItem
              key={sectionId}
              section={section}
              sectionId={sectionId}
              sectionIndex={sectionIndex}
              isDragged={isSectionDragged}
              isDragOver={isSectionDragOver}
              draggedItem={draggedItem}
              dragOverSection={dragOverSection}
              wasJustDragged={wasJustDragged}
              onSectionDragStart={handleSectionDragStart}
              onSectionDragEnd={handleDragEnd}
              onSectionDragOver={handleSectionDragOver}
              onSectionDrop={handleSectionDrop}
              onLectureDragStart={handleLectureDragStart}
              onLectureDragEnd={handleLectureDragEnd}
              onLectureDragOver={handleLectureDragOver}
              onLectureDrop={handleLectureDrop}
              onEditSectionName={handleChangeEditSectionName}
              onDeleteSection={handleDeleteSectionWithModal}
              onAddLecture={setAddSubsection}
              onViewLecture={setViewSubSection}
              onEditLecture={(lecture, sectionId) => setEditSubSection({ ...lecture, sectionId })}
              onDeleteLecture={handleDeleteLectureWithModal}
              setConfirmationModal={setConfirmationModal}
              setWasJustDragged={setWasJustDragged}
            />
          );
        })}
      </div>

      <ModalsContainer
        addSubSection={addSubSection}
        viewSubSection={viewSubSection}
        editSubSection={editSubSection}
        confirmationModal={confirmationModal}
        showMoveWarning={showMoveWarning}
        pendingMove={pendingMove}
        setAddSubsection={setAddSubsection}
        setViewSubSection={setViewSubSection}
        setEditSubSection={setEditSubSection}
        setConfirmationModal={setConfirmationModal}
        confirmMoveLecture={confirmMoveLecture}
        cancelMoveLecture={cancelMoveLecture}
      />
    </>
  );
}

import { Course, Section } from "@modules/course/types";
import { NestedViewProps } from "../../types/index";
import { useNestedView } from "../../hooks/useNestedView";
import SectionItem from "./components/SectionItem";
import ModalsContainer from "./components/ModalsContainer";

export default function NestedView({
  handleChangeEditSectionName,
}: NestedViewProps) {
  const {
    course,
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
  } = useNestedView();

  if (!course) return null;
  const courseData = course as Course;

  return (
    <>
      <div
        className="rounded-2xl bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 p-6 px-8"
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

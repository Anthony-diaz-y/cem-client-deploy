import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import { Section, SubSection } from "@modules/course/types";
import { type ConfirmationModalData } from "@shared/components";
import LectureItem from "./LectureItem";

interface SectionItemProps {
  section: Section;
  sectionId: string;
  sectionIndex: number;
  isDragged: boolean;
  isDragOver: boolean;
  draggedItem: { type: string; sectionId?: string; sourceSectionId?: string; lectureId?: string } | null;
  dragOverSection: string | null;
  wasJustDragged: boolean;
  onSectionDragStart: (e: React.DragEvent, sectionId: string) => void;
  onSectionDragEnd: () => void;
  onSectionDragOver: (e: React.DragEvent, sectionId: string) => void;
  onSectionDrop: (e: React.DragEvent, sectionId: string) => void;
  onLectureDragStart: (e: React.DragEvent, sectionId: string, subSectionId: string) => void;
  onLectureDragEnd: () => void;
  onLectureDragOver: (e: React.DragEvent, sectionId: string) => void;
  onLectureDrop: (e: React.DragEvent, sectionId: string, subSectionIndex?: number) => void;
  onEditSectionName: (sectionId: string, sectionName: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddLecture: (sectionId: string) => void;
  onViewLecture: (lecture: SubSection) => void;
  onEditLecture: (lecture: SubSection, sectionId: string) => void;
  onDeleteLecture: (subSectionId: string, sectionId: string) => void;
  setConfirmationModal: (modal: ConfirmationModalData | null) => void;
  setWasJustDragged: (value: boolean) => void;
}

// Componente para cada sección individual
export default function SectionItem({
  section,
  sectionId,
  sectionIndex,
  isDragged,
  isDragOver,
  draggedItem,
  dragOverSection,
  wasJustDragged,
  onSectionDragStart,
  onSectionDragEnd,
  onSectionDragOver,
  onSectionDrop,
  onLectureDragStart,
  onLectureDragEnd,
  onLectureDragOver,
  onLectureDrop,
  onEditSectionName,
  onDeleteSection,
  onAddLecture,
  onViewLecture,
  onEditLecture,
  onDeleteLecture,
  setConfirmationModal,
  setWasJustDragged,
}: SectionItemProps) {
  const subSectionsArray = (section.subSection && Array.isArray(section.subSection))
    ? section.subSection
    : ((section as { subSections?: SubSection[] }).subSections && Array.isArray((section as { subSections?: SubSection[] }).subSections))
      ? (section as { subSections?: SubSection[] }).subSections
      : [];

  const handleSectionDragStart = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const isFromLecture = target.closest('[data-lecture-draggable]');

    if (!isFromLecture) {
      onSectionDragStart(e, sectionId);
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleSectionDragOver = (e: React.DragEvent) => {
    if (draggedItem?.type === "section" ||
      (draggedItem?.type === "lecture" && draggedItem?.sourceSectionId !== sectionId)) {
      e.preventDefault();
      onSectionDragOver(e, sectionId);
    }
  };

  const handleLectureDragEnd = () => {
    onLectureDragEnd();
    setTimeout(() => {
      setWasJustDragged(false);
    }, 200);
  };

  return (
    <details
      key={sectionId}
      open
      draggable
      onDragStart={handleSectionDragStart}
      onDragEnd={onSectionDragEnd}
      onDragOver={handleSectionDragOver}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSectionDrop(e, sectionId);
      }}
      className={`transition-all duration-200 ${isDragged
          ? "opacity-50 scale-95"
          : isDragOver
            ? "border-l-4 border-l-yellow-500 bg-yellow-500/10"
            : ""
        }`}
    >
      <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-cem-neutral-gray-200 py-2">
        <div className="flex items-center gap-x-3">
          <HiMenu className="text-xl text-cem-neutral-gray-400 cursor-grab active:cursor-grabbing" />
          <RxDropdownMenu className="text-2xl text-cem-neutral-gray-900" />
          <p className="font-semibold text-cem-neutral-gray-900">
            {section.sectionName}
          </p>
        </div>

        <div className="flex items-center gap-x-3">
          <button onClick={() => onEditSectionName(sectionId, section.sectionName)}>
            <MdEdit className="text-xl text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600 transition-colors" />
          </button>

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "¿Eliminar esta Sección?",
                text2: "Todas las lecciones en esta sección serán eliminadas",
                btn1Text: "Eliminar",
                btn2Text: "Cancelar",
                btn1Handler: () => onDeleteSection(sectionId),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            <RiDeleteBin6Line className="text-xl text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600 transition-colors" />
          </button>

          <span className="font-medium text-cem-neutral-gray-300">|</span>
          <AiFillCaretDown className={`text-xl text-cem-neutral-gray-400`} />
        </div>
      </summary>

      <div
        className="px-6 pb-4 min-h-[50px]"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSectionDragOver(e, sectionId);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLectureDrop(e, sectionId, undefined);
        }}
      >
        {subSectionsArray && subSectionsArray.length > 0 ? (
          subSectionsArray.map((lecture: SubSection, subSectionIndex: number) => {
            const subSectionId = (lecture as { id?: string })?.id || lecture?._id || `subsection-${sectionIndex}-${subSectionIndex}`;

            const isLectureDragged =
              draggedItem?.type === "lecture" &&
              draggedItem?.lectureId === subSectionId;
            const isLectureDragOver =
              dragOverSection === sectionId &&
              draggedItem?.type === "lecture" &&
              draggedItem?.sourceSectionId !== sectionId;

            return (
              <LectureItem
                key={subSectionId}
                lecture={lecture}
                subSectionId={subSectionId}
                sectionId={sectionId}
                sectionIndex={sectionIndex}
                subSectionIndex={subSectionIndex}
                isDragged={isLectureDragged}
                isDragOver={isLectureDragOver}
                wasJustDragged={wasJustDragged}
                onDragStart={onLectureDragStart}
                onDragOver={onLectureDragOver}
                onDragEnd={handleLectureDragEnd}
                onDrop={onLectureDrop}
                onClick={onViewLecture}
                onEdit={onEditLecture}
                onDelete={onDeleteLecture}
                setConfirmationModal={setConfirmationModal}
              />
            );
          })
        ) : (
          <p className="text-cem-neutral-gray-500 text-sm py-2">No hay lecciones en esta sección</p>
        )}

        <button
          onClick={() => onAddLecture(sectionId)}
          className="mt-3 flex items-center gap-x-1 text-cem-primary font-semibold hover:text-cem-primary-dark transition-colors"
        >
          <FaPlus className="text-lg" />
          <p>Agregar Lección</p>
        </button>
      </div>
    </details>
  );
}



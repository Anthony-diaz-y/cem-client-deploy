import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
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
      <summary className="flex cursor-pointer items-center justify-between py-0.5 transition-all">
        <div className="flex items-center gap-x-2">
          <HiMenu className="text-xl text-cem-neutral-gray-300 cursor-grab active:cursor-grabbing hover:text-cem-neutral-gray-500 transition-colors" />
          <p className="font-bold text-base text-cem-neutral-gray-900">
            {section.sectionName}
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <button
            type="button"
            onClick={() => onEditSectionName(sectionId, section.sectionName)}
            className="p-1 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-cem-neutral-gray-100"
          >
            <MdEdit className="text-lg text-cem-neutral-gray-400 hover:text-cem-primary transition-colors" />
          </button>

          <button
            type="button"
            className="p-1 hover:bg-red-50 rounded-lg transition-all shadow-sm border border-transparent hover:border-red-100"
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
            <RiDeleteBin6Line className="text-lg text-cem-neutral-gray-400 hover:text-red-500 transition-colors" />
          </button>

          <div className="w-px h-5 bg-cem-neutral-gray-200 mx-0.5" />
          <AiFillCaretDown className="text-lg text-cem-neutral-gray-400 group-open:rotate-180 transition-transform" />
        </div>
      </summary>

      {/* Header divider removed for maximum tightness if desired, or kept very thin */}
      <div className="h-px bg-cem-neutral-gray-200/60 w-full" />

      <div
        className="px-0.5 min-h-[10px] divide-y divide-cem-neutral-gray-200/50"
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
          <p className="text-cem-neutral-gray-500 text-sm py-1">No hay lecciones en esta sección</p>
        )}

        {/* Re-added delimiting line before the action button with perfect alignment */}


        <button
          onClick={() => onAddLecture(sectionId)}
          className="flex items-center  gap-x-1.5 text-cem-primary font-bold hover:text-cem-primary-dark transition-colors group/btn py-1 ml-1"
        >
          <div className="w-5 h-5 mt-2 rounded-md bg-cem-primary/5 flex items-center justify-center group-hover/btn:bg-cem-primary group-hover/btn:text-white transition-all">
            <FaPlus className="text-[10px]" />
          </div>
          <p className="text-[13px] mt-2">Agregar Lección</p>
        </button>
      </div>
    </details>
  );
}



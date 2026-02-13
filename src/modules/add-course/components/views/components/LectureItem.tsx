import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import { SubSection } from "@modules/course/types";
import { type ConfirmationModalData } from "@shared/components";

interface LectureItemProps {
  lecture: SubSection;
  subSectionId: string;
  sectionId: string;
  sectionIndex: number;
  subSectionIndex: number;
  isDragged: boolean;
  isDragOver: boolean;
  wasJustDragged: boolean;
  onDragStart: (e: React.DragEvent, sectionId: string, subSectionId: string) => void;
  onDragOver: (e: React.DragEvent, sectionId: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, sectionId: string, subSectionIndex?: number) => void;
  onClick: (lecture: SubSection) => void;
  onEdit: (lecture: SubSection, sectionId: string) => void;
  onDelete: (subSectionId: string, sectionId: string) => void;
  setConfirmationModal: (modal: ConfirmationModalData | null) => void;
}

export default function LectureItem({
  lecture,
  subSectionId,
  sectionId,
  sectionIndex,
  subSectionIndex,
  isDragged,
  isDragOver,
  wasJustDragged,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onClick,
  onEdit,
  onDelete,
  setConfirmationModal,
}: LectureItemProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart(e, sectionId, subSectionId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", subSectionId);
    e.dataTransfer.setData("sectionId", sectionId);
    e.dataTransfer.setData("type", "lecture");
  };

  const handleClick = (e: React.MouseEvent) => {
    if (wasJustDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick(lecture);
  };

  const handleEdit = () => {
    if (!sectionId || typeof sectionId !== 'string') {
      return;
    }
    onEdit(lecture, sectionId);
  };

  const handleDelete = () => {
    setConfirmationModal({
      text1: "¿Eliminar esta Sub-Sección?",
      text2: "Esta lección será eliminada",
      btn1Text: "Eliminar",
      btn2Text: "Cancelar",
      btn1Handler: () => onDelete(subSectionId, sectionId),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <div
      data-lecture-draggable="true"
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver(e, sectionId);
      }}
      onDragEnd={onDragEnd}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(e, sectionId, subSectionIndex ?? undefined);
      }}
      onClick={handleClick}
      className={`flex cursor-grab active:cursor-grabbing items-center justify-between gap-x-3 border-b-2 border-b-cem-neutral-gray-200 py-2 transition-all duration-200 ${isDragged
          ? "opacity-50 scale-95 bg-cem-neutral-gray-50"
          : isDragOver
            ? "bg-yellow-500/20 border-yellow-500"
            : "hover:bg-cem-neutral-gray-100"
        }`}
    >
      <div className="flex items-center gap-x-3 py-2">
        <HiMenu className="text-lg text-cem-neutral-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 pointer-events-none" />
        <RxDropdownMenu className="text-2xl text-cem-neutral-gray-900" />
        <p className="font-semibold text-cem-neutral-gray-900">
          {lecture.title}
        </p>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-x-3"
      >
        <button onClick={handleEdit}>
          <MdEdit className="text-xl text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600 transition-colors" />
        </button>
        <button onClick={handleDelete}>
          <RiDeleteBin6Line className="text-xl text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600 transition-colors" />
        </button>
      </div>
    </div>
  );
}


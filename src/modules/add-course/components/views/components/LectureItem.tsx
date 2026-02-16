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
      className={`group flex cursor-grab active:cursor-grabbing border-b border-cem-neutral-gray-200/60 items-center justify-between gap-x-2 py-1 px-0.5 transition-all duration-200 ${isDragged
        ? "opacity-50 scale-95 bg-cem-neutral-gray-50"
        : isDragOver
          ? "bg-cem-primary/5 rounded-lg"
          : "hover:bg-white hover:shadow-sm rounded-lg"
        }`}
    >
      <div className="flex items-center gap-x-2.5">
        <HiMenu className="text-lg text-cem-neutral-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0 pointer-events-none group-hover:text-cem-neutral-gray-400 transition-colors" />
        <div className="w-8 h-8 rounded-lg bg-cem-neutral-gray-50 flex items-center justify-center text-cem-neutral-gray-400 group-hover:bg-cem-primary/10 group-hover:text-cem-primary transition-all">
          <RxDropdownMenu size={18} />
        </div>
        <p className="font-medium text-[13px] text-cem-neutral-gray-700 group-hover:text-cem-neutral-gray-900 transition-colors leading-none">
          {lecture.title}
        </p>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          onClick={handleEdit}
          className="p-1.5 hover:bg-cem-primary/10 rounded-lg text-cem-neutral-gray-400 hover:text-cem-primary transition-all"
        >
          <MdEdit size={20} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-red-50 rounded-lg text-cem-neutral-gray-400 hover:text-red-500 transition-all"
        >
          <RiDeleteBin6Line size={20} />
        </button>
      </div>
    </div>
  );
}


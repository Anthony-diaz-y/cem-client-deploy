import { MdEdit, MdQuiz } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import { SubSection } from "@modules/course/types";
import { type ConfirmationModalData } from "@shared/components";

interface LectureItemProps {
  lecture: SubSection;
  subSectionId: string;
  sectionId: string;
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
  onQuiz: (lecture: SubSection, sectionId: string) => void;
  onDelete: (subSectionId: string, sectionId: string) => void;
  setConfirmationModal: (modal: ConfirmationModalData | null) => void;
}

export default function LectureItem({
  lecture,
  subSectionId,
  sectionId,
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
  onQuiz,
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

  const handleQuiz = () => {
    if (!sectionId || typeof sectionId !== 'string') {
      return;
    }
    onQuiz(lecture, sectionId);
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

  const hasQuiz = lecture.questions && lecture.questions.length > 0;

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
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${hasQuiz
          ? "bg-cem-primary/10 text-cem-primary"
          : "bg-cem-neutral-gray-50 text-cem-neutral-gray-400 group-hover:bg-cem-primary/10 group-hover:text-cem-primary"
          }`}>
          <RxDropdownMenu size={18} />
        </div>
        <p className={`font-medium text-[13px] transition-colors leading-none ${hasQuiz ? "text-cem-primary font-bold" : "text-cem-neutral-gray-700 group-hover:text-cem-neutral-gray-900"
          }`}>
          {lecture.title} {hasQuiz && <span className="text-[9px] font-black uppercase ml-1.5 px-1.5 py-0.5 bg-cem-primary/10 text-cem-primary rounded-md tracking-tighter">(Quiz Activo)</span>}
        </p>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
      >
        <button
          onClick={handleQuiz}
          title={hasQuiz ? "Editar Quiz" : "Agregar Quiz"}
          className={`p-1.5 rounded-lg transition-all ${hasQuiz
            ? "bg-cem-primary/10 text-cem-primary hover:bg-cem-primary/20 border border-cem-primary/20"
            : "hover:bg-cem-primary/10 text-cem-neutral-gray-400 hover:text-cem-primary"
            }`}
        >
          <MdQuiz size={18} />
        </button>
        <button
          onClick={handleEdit}
          title="Editar Lección"
          className="p-1.5 hover:bg-cem-primary/10 rounded-lg text-cem-neutral-gray-400 hover:text-cem-primary transition-all"
        >
          <MdEdit size={18} />
        </button>
        <button
          onClick={handleDelete}
          title="Eliminar"
          className="p-1.5 hover:bg-red-50 rounded-lg text-cem-neutral-gray-400 hover:text-red-500 transition-all"
        >
          <RiDeleteBin6Line size={18} />
        </button>
      </div>
    </div>
  );
}


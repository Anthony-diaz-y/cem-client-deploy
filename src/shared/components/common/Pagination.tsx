import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl bg-white border border-cem-neutral-gray-100 text-cem-primary hover:border-cem-primary hover:bg-cem-primary/5 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Página anterior"
      >
        <FiChevronLeft size={20} />
      </button>

      <span className="text-cem-neutral-gray-400 text-xs font-medium uppercase tracking-widest">
        Página <span className="font-black text-cem-neutral-gray-900">{currentPage}</span> de{" "}
        <span className="font-black text-cem-neutral-gray-900">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl bg-white border border-cem-neutral-gray-100 text-cem-primary hover:border-cem-primary hover:bg-cem-primary/5 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Siguiente página"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
}
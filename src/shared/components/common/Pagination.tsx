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
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-richblack-800 border border-richblack-700 text-richblack-300 hover:text-richblack-5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <FiChevronLeft size={20} />
      </button>

      <span className="text-richblack-300 text-sm">
        Página <span className="font-bold text-white">{currentPage}</span> de{" "}
        <span className="font-bold text-white">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-richblack-800 border border-richblack-700 text-richblack-300 hover:text-richblack-5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <FiChevronRight size={20} />
      </button>
    </div >
  );
}
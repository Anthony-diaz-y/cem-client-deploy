"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import IconBtn from "@shared/components/IconBtn";
import { setCourseViewSidebar } from "@modules/dashboard/store/sidebarSlice";
import { RootState, AppDispatch } from "@shared/store/store";
import { SidebarHeaderProps } from "../types";

/**
 * SidebarHeader - Header component for video details sidebar
 */
const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  courseName,
  completedLectures,
  totalNoOfLectures,
  onReviewClick,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { courseViewSidebar } = useSelector(
    (state: RootState) => state.sidebar
  );

  return (
    <div className="mx-4 flex flex-col items-start justify-between gap-3 border-b border-richblack-700 py-4 bg-richblack-800">
      <div className="flex w-full items-center justify-between">
        <div
          className="sm:hidden text-white cursor-pointer hover:text-yellow-200 transition-colors"
          onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
        >
          {courseViewSidebar ? (
            <IoMdClose size={28} />
          ) : (
            <HiMenuAlt1 size={28} />
          )}
        </div>

        <button
          onClick={() => {
            router.push(`/dashboard/enrolled-courses`);
          }}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-lg bg-richblack-700 p-1 text-richblack-5 hover:bg-richblack-600 hover:scale-105 transition-all border border-richblack-600"
          title="Volver"
        >
          <IoIosArrowBack size={24} />
        </button>

        <IconBtn text="Add Review" onclick={onReviewClick} />
      </div>

      <div className="flex flex-col w-full px-1">
        <h2 className="text-lg font-bold text-richblack-5 truncate mb-1">
          {courseName || "Curso"}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-richblack-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-200 rounded-full transition-all duration-300"
              style={{ 
                width: `${totalNoOfLectures > 0 ? (completedLectures?.length || 0) / totalNoOfLectures * 100 : 0}%` 
              }}
            />
          </div>
          <p className="text-sm font-semibold text-richblack-400 whitespace-nowrap">
            {completedLectures?.length || 0} / {totalNoOfLectures}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;

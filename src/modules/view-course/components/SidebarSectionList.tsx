"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import { setCourseViewSidebar } from "@modules/dashboard/store/sidebarSlice";
import { RootState, AppDispatch } from "@shared/store/store";
import { Section, SidebarSectionListProps } from "../types";

/**
 * SidebarSectionList - Section list component for video details sidebar
 */
const SidebarSectionList: React.FC<SidebarSectionListProps> = ({
  courseSectionData,
  courseId,
  activeStatus,
  videoBarActive,
  completedLectures,
  onSectionClick,
  onSubSectionClick,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { courseViewSidebar } = useSelector(
    (state: RootState) => state.sidebar
  );

  const handleSubSectionClick = (sectionId: string, subSectionId: string) => {
    onSubSectionClick(sectionId, subSectionId);
    router.push(
      `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`
    );
    if (
      courseViewSidebar &&
      typeof window !== "undefined" &&
      window.innerWidth <= 640
    ) {
      dispatch(setCourseViewSidebar(false));
    }
  };

  return (
    <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
      {courseSectionData.map((section: Section, index: number) => (
        <div
          className="mt-2 cursor-pointer text-sm text-richblack-5"
          onClick={() => onSectionClick(section?._id)}
          key={index}
        >
          <div className="flex justify-between bg-richblack-700 px-5 py-4">
            <div className="w-[70%] font-semibold">{section?.sectionName}</div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-medium">
                Lession {section?.subSection.length}
              </span>
              <span
                className={`${
                  activeStatus === section?._id
                    ? "rotate-0 transition-all duration-500"
                    : "rotate-180"
                }`}
              >
                <BsChevronDown />
              </span>
            </div>
          </div>

          {activeStatus === section?._id && (
            <div className="transition-[height] duration-500 ease-in-out">
              {section.subSection.map((topic, i: number) => (
                <div
                  className={`flex gap-3 px-5 py-2 ${
                    videoBarActive === topic._id
                      ? "bg-yellow-200 font-semibold text-richblack-800"
                      : "hover:bg-richblack-900"
                  }`}
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubSectionClick(section._id, topic._id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={completedLectures.includes(topic?._id)}
                    onChange={() => {}}
                  />
                  {topic.title}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarSectionList;

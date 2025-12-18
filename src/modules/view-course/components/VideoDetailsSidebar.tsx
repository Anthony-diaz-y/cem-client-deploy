"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@shared/store/store";
import SidebarHeader from "./SidebarHeader";
import SidebarSectionList from "./SidebarSectionList";
import { useSidebarState } from "../hooks/useSidebarState";
import { VideoDetailsSidebarProps } from "../types";

/**
 * VideoDetailsSidebar - Sidebar component for video details page
 * Orchestrates sidebar state and rendering through custom hooks and components
 */
export default function VideoDetailsSidebar({
  setReviewModal,
}: VideoDetailsSidebarProps) {
  const params = useParams();
  const courseId = params?.courseId as string;
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state: RootState) => state.viewCourse);

  const { activeStatus, videoBarActive, setActiveStatus, setVideoBarActive } =
    useSidebarState(courseSectionData);

  const handleSubSectionClick = (sectionId: string, subSectionId: string) => {
    setVideoBarActive(subSectionId);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
      <div className="flex-shrink-0 border-b border-richblack-700">
        <SidebarHeader
          courseName={courseEntireData?.courseName}
          completedLectures={completedLectures}
          totalNoOfLectures={totalNoOfLectures}
          onReviewClick={() => setReviewModal(true)}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <SidebarSectionList
          courseSectionData={courseSectionData}
          courseId={courseEntireData?._id || courseId}
          activeStatus={activeStatus}
          videoBarActive={videoBarActive}
          completedLectures={completedLectures}
          onSectionClick={setActiveStatus}
          onSubSectionClick={handleSubSectionClick}
        />
      </div>
    </div>
  );
}

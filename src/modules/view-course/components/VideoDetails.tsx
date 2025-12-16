"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiMenuAlt1 } from "react-icons/hi";
import { setCourseViewSidebar } from "../../dashboard/store/sidebarSlice";
import { RootState } from "../../../shared/store/store";
import VideoPlayer from "./VideoPlayer";
import { useVideoNavigation } from "../hooks/useVideoNavigation";
import { useVideoPlayer } from "../hooks/useVideoPlayer";

/**
 * VideoDetails - Main component for video details page
 * Orchestrates video player and navigation logic through custom hooks
 */
const VideoDetails = () => {
  const dispatch = useDispatch();
  const { courseSectionData, courseEntireData } = useSelector(
    (state: RootState) => state.viewCourse
  );
  const { courseViewSidebar } = useSelector(
    (state: RootState) => state.sidebar
  );

  const {
    isFirstVideo,
    isLastVideo,
    goToNextVideo,
    goToPrevVideo,
  } = useVideoNavigation(courseSectionData);

  const {
    playerRef,
    videoData,
    previewSource,
    videoEnded,
    loading,
    setVideoEnded,
    handleLectureCompletion,
    handleRewatch,
    isCompleted,
  } = useVideoPlayer(courseSectionData, courseEntireData);

  // Hide video content when sidebar is open on small devices
  if (
    courseViewSidebar &&
    typeof window !== "undefined" &&
    window.innerWidth <= 640
  )
    return null;

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Sidebar toggle button */}
      <div
        className="sm:hidden text-white absolute left-7 top-3 cursor-pointer"
        onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
      >
        {!courseViewSidebar && <HiMenuAlt1 size={33} />}
      </div>

      <VideoPlayer
        videoData={videoData}
        previewSource={previewSource}
        videoEnded={videoEnded}
        playerRef={playerRef}
        onVideoEnd={() => setVideoEnded(true)}
        onMarkComplete={handleLectureCompletion}
        onRewatch={handleRewatch}
        onNext={goToNextVideo}
        onPrev={goToPrevVideo}
        loading={loading}
        isCompleted={isCompleted}
        isFirst={isFirstVideo()}
        isLast={isLastVideo()}
      />

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;

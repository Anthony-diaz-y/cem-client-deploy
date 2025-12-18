"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiMenuAlt1 } from "react-icons/hi";
import { setCourseViewSidebar } from "@modules/dashboard/store/sidebarSlice";
import { RootState } from "@shared/store/store";
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

  const { isFirstVideo, isLastVideo, goToNextVideo, goToPrevVideo, getNextVideoInfo } =
    useVideoNavigation(courseSectionData);

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

  // Log para depuración
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("VideoDetails - Current state:", {
        hasVideoData: !!videoData,
        videoTitle: videoData?.title,
        videoUrl: videoData?.videoUrl,
        hasVideoUrl: !!videoData?.videoUrl,
        courseSectionDataLength: courseSectionData.length,
        hasCourseEntireData: !!courseEntireData,
      });
    }
  }, [videoData, courseSectionData, courseEntireData]);

  // Handle client-side only rendering to avoid hydration errors
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Hide video content when sidebar is open on small devices (only on client)
  if (mounted && courseViewSidebar && window.innerWidth <= 640) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-richblack-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-white pb-12 md:pb-16">
      {/* Sidebar toggle button */}
      <div
        className="sm:hidden text-white absolute left-7 top-3 cursor-pointer z-10"
        onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
      >
        {!courseViewSidebar && <HiMenuAlt1 size={33} />}
      </div>

      {/* Video Player Container - Más pequeño y centrado */}
      <div className="w-full max-w-4xl mx-auto">
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
          nextVideoInfo={getNextVideoInfo()}
        />
      </div>

      {/* Video Info Section */}
      {videoData ? (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-richblack-800 rounded-xl p-6 md:p-8 pb-8 md:pb-10 border border-richblack-700 shadow-lg">
            {/* Title Section */}
            <div className="mb-4 pb-4 border-b border-richblack-700">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-richblack-5 mb-3 leading-tight">
                {videoData.title || "Sin título"}
              </h1>
              
              {/* Video Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-richblack-400">
                {videoData.timeDuration && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      {(() => {
                        const duration = typeof videoData.timeDuration === 'string' 
                          ? parseFloat(videoData.timeDuration) 
                          : videoData.timeDuration;
                        if (!duration) return '';
                        const seconds = Math.round(duration);
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = seconds % 60;
                        return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
                      })()}
                    </span>
                  </div>
                )}
                {isCompleted && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-200 font-medium">Completado</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-4 mb-2">
              <h2 className="text-sm font-semibold text-richblack-400 uppercase tracking-wide mb-3">
                Descripción
              </h2>
              <p className="text-base md:text-lg text-richblack-300 leading-relaxed whitespace-pre-wrap break-words">
                {videoData.description || "No hay descripción disponible para este video."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 shadow-lg text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-richblack-700 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-richblack-700 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-lg text-richblack-400 mt-4">Cargando información del video...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;

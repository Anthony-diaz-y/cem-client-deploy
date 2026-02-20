"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { HiMenuAlt1 } from "react-icons/hi";
import { AiOutlineFilePdf, AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFile } from "react-icons/ai";
import { setCourseViewSidebar, setDiscussionSidebarOpen } from "@modules/dashboard/store/sidebarSlice";
import { RootState } from "@shared/store/store";
import VideoPlayer from "./VideoPlayer";
import { useVideoNavigation } from "../hooks/useVideoNavigation";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import DiscussionButton from "./discussions/DiscussionButton";
import { getDiscussions } from "../services/discussionAPI";
import { VIEW_COURSE_TEXTS } from "../constants/viewCourse.constants";
import StudentQuizView from "./StudentQuizView";

/**
 * VideoDetails - Main component for video details page
 * Orchestrates video player and navigation logic through custom hooks
 */
const VideoDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { courseSectionData, courseEntireData } = useSelector(
    (state: RootState) => state.viewCourse
  );
  const { courseViewSidebar } = useSelector(
    (state: RootState) => state.sidebar
  );

  // Obtener subSectionId de los parámetros
  const subSectionId = Array.isArray(params?.subSectionId)
    ? params.subSectionId[0]
    : params?.subSectionId as string;

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

  // Estado para el conteo de discusiones
  const [discussionCount, setDiscussionCount] = React.useState(0);

  // Obtener el conteo de discusiones
  React.useEffect(() => {
    if (!subSectionId) {
      setDiscussionCount(0);
      return;
    }

    const loadDiscussionCount = async () => {
      try {
        const discussions = await getDiscussions(subSectionId);
        setDiscussionCount(discussions.length);
      } catch (error) {
        console.error(VIEW_COURSE_TEXTS.discussions.errors.loadCount, error);
        setDiscussionCount(0);
      }
    };

    loadDiscussionCount();
  }, [subSectionId]);

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
        <p className="text-richblack-400">{VIEW_COURSE_TEXTS.videoDetails.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-white">
      {/* Sidebar toggle button */}
      <div
        className="sm:hidden text-white absolute left-7 top-3 cursor-pointer z-10"
        onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
      >
        {!courseViewSidebar && <HiMenuAlt1 size={33} />}
      </div>

      {/* 1. Título */}
      {videoData ? (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-richblack-900 mb-0">
            {videoData.title || VIEW_COURSE_TEXTS.videoDetails.noTitle}
          </h1>
        </div>
      ) : null}

      {/* 2. Video Player / Quiz */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {videoData?.videoUrl && (
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
        )}

        {videoData?.questions && videoData.questions.length > 0 && (
          <div className={`${videoData?.videoUrl ? "mt-12 border-t border-richblack-700 pt-12" : ""}`}>
            {videoData?.videoUrl && (
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Evaluación de la Lección</h2>
              </div>
            )}
            <StudentQuizView
              questions={videoData.questions}
              quizTitle={videoData.quizTitle || (videoData?.videoUrl ? "Evaluación Rápida" : (videoData.title || "Quiz"))}
            />
          </div>
        )}

        {!videoData?.videoUrl && (!videoData?.questions || videoData.questions.length === 0) && videoData && (
          <div className="w-full aspect-video rounded-xl flex flex-col items-center justify-center bg-richblack-800 border border-richblack-700 gap-4 p-8">
            <svg className="w-16 h-16 text-richblack-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.277A1 1 0 0121 8.617v6.766a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              />
            </svg>
            <div className="text-center">
              <p className="text-richblack-300 font-semibold text-lg">Esta lección no tiene un video configurado ni un quiz activo</p>
              <p className="text-richblack-500 text-sm mt-1">El instructor aún no ha añadido contenido a esta lección.</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Línea separadora + metadata + botón de discusión */}
      {videoData && (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="border-b border-richblack-200 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-richblack-500">
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
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-600 font-medium">{VIEW_COURSE_TEXTS.videoDetails.completed}</span>
                  </div>
                )}
              </div>

              {/* Discussion Button */}
              {subSectionId && (
                <DiscussionButton
                  onClick={() => {
                    dispatch(setDiscussionSidebarOpen(true));
                    dispatch(setCourseViewSidebar(false));
                  }}
                  discussionCount={discussionCount}
                />
              )}
            </div>
          </div>
        </div>
      )}


      {/* Content Section - Premium Design */}
      {videoData ? (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Text Content - Direct display without header (DevTalles style) */}
          {(videoData.description || videoData.content) && (
            <div className="bg-richblack-800/50 backdrop-blur-sm rounded-2xl p-8 border border-richblack-700/50 shadow-xl">
              <div className="prose prose-invert prose-lg max-w-none">
                <div
                  className="lesson-rich-content text-richblack-100 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: videoData.content || videoData.description }}
                />
              </div>
            </div>
          )}

          <style jsx global>{`
            .lesson-rich-content {
              line-height: 1.8;
            }
            .lesson-rich-content h1 {
              font-size: 2.5em !important;
              font-weight: 700 !important;
              margin-top: 1.5rem !important;
              margin-bottom: 1rem !important;
              color: #F1F2FF !important;
              line-height: 1.2 !important;
            }
            .lesson-rich-content h2 {
              font-size: 2em !important;
              font-weight: 600 !important;
              margin-top: 1.25rem !important;
              margin-bottom: 0.875rem !important;
              color: #F1F2FF !important;
              line-height: 1.3 !important;
            }
            .lesson-rich-content h3 {
              font-size: 1.5em !important;
              font-weight: 600 !important;
              margin-top: 1rem !important;
              margin-bottom: 0.75rem !important;
              color: #F1F2FF !important;
            }
            .lesson-rich-content p {
              margin-bottom: 1rem !important;
              color: #AFB2BF !important;
            }
            .lesson-rich-content a {
              color: #47A5C5 !important;
              text-decoration: underline !important;
              font-weight: 500;
              transition: color 0.2s;
              cursor: pointer;
            }
            .lesson-rich-content a:hover {
              color: #FFD60A !important;
            }
            .lesson-rich-content ul {
              list-style-type: disc !important;
              padding-left: 1.5rem !important;
              margin-bottom: 1rem !important;
            }
            .lesson-rich-content ol {
              list-style-type: decimal !important;
              padding-left: 1.5rem !important;
              margin-bottom: 1rem !important;
            }
            .lesson-rich-content blockquote {
              border-left: 4px solid #FFD60A !important;
              padding-left: 1rem !important;
              margin: 1.5rem 0 !important;
              font-style: italic !important;
              color: #AFB2BF !important;
            }
            .lesson-rich-content strong {
              font-weight: 600 !important;
              color: #F1F2FF !important;
            }
            .lesson-rich-content em {
              font-style: italic !important;
            }
            .lesson-rich-content code {
              background-color: #161D29 !important;
              padding: 0.2rem 0.4rem !important;
              border-radius: 0.25rem !important;
              font-family: monospace !important;
              font-size: 0.9em !important;
              color: #FFD60A !important;
            }
          `}</style>

          {/* Attachments Section - Premium Card Design */}
          {videoData.attachments && videoData.attachments.length > 0 && (
            <div className="bg-richblack-800/50 backdrop-blur-sm rounded-2xl p-8 border border-richblack-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full"></div>
                <h2 className="text-lg font-semibold text-richblack-5 tracking-wide">
                  {VIEW_COURSE_TEXTS.videoDetails.attachments.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {videoData.attachments.map((attachment: { url: string; name: string; type: string }, index: number) => {
                  const renderIcon = (type: string) => {
                    if (type.includes("pdf")) return <AiOutlineFilePdf className="text-pink-200 text-2xl" />;
                    if (type.includes("word") || type.includes("officedocument.wordprocessingml")) return <AiOutlineFileWord className="text-blue-200 text-2xl" />;
                    if (type.includes("excel") || type.includes("officedocument.spreadsheetml")) return <AiOutlineFileExcel className="text-caribbeangreen-200 text-2xl" />;
                    return <AiOutlineFile className="text-richblack-200 text-2xl" />;
                  };

                  return (
                    <a
                      key={index}
                      href={attachment.url}
                      download={attachment.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-5 bg-richblack-700/50 hover:bg-richblack-700 border border-richblack-600/50 hover:border-richblack-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-richblack-800 rounded-lg group-hover:bg-richblack-900 transition-colors">
                        {renderIcon(attachment.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-richblack-5 font-medium text-base truncate group-hover:text-yellow-50 transition-colors">
                          {attachment.name}
                        </p>
                        <p className="text-richblack-400 text-sm mt-1">
                          {attachment.type.split('/')[1]?.toUpperCase() || VIEW_COURSE_TEXTS.videoDetails.attachments.fileType}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-richblack-400 group-hover:text-yellow-50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-richblack-800 rounded-xl p-8 border border-richblack-700 shadow-lg text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-richblack-700 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-richblack-700 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-lg text-richblack-400 mt-4">{VIEW_COURSE_TEXTS.videoDetails.loadingVideo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;

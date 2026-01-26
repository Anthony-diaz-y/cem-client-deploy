"use client";

import React, { useRef, useEffect, useState } from "react";
import { VideoPlayerProps } from "../types";
import { VIEW_COURSE_TEXTS } from "../constants/viewCourse.constants";

/**
 * VideoPlayer - Video player component using native HTML5 video
 * Displays video player with controls, compatible with React 19
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoData,
  previewSource,
  videoEnded,
  playerRef,
  onVideoEnd,
  onMarkComplete,
  onRewatch,
  onNext,
  onPrev,
  loading,
  isCompleted,
  isFirst,
  isLast,
  nextVideoInfo,
}) => {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

  // Expose seek method to parent component via ref
  useEffect(() => {
    if (playerRef && videoElementRef.current) {
      playerRef.current = {
        seek: (time: number) => {
          if (videoElementRef.current) {
            videoElementRef.current.currentTime = time;
          }
        },
      };
    }
  }, [playerRef]);

  // Handle video end
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;

    const handleEnded = () => {
      onVideoEnd();
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onVideoEnd]);

  // Función para validar videoUrl
  const validateVideoUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;

    const trimmedUrl = url.trim();

    // Verificar que no sea 'null', 'undefined' o vacío
    if (trimmedUrl === '' ||
      trimmedUrl === 'null' ||
      trimmedUrl === 'undefined' ||
      trimmedUrl.toLowerCase() === 'null' ||
      trimmedUrl.toLowerCase() === 'undefined') {
      return null;
    }

    // Verificar que sea una URL válida
    try {
      const urlObj = new URL(trimmedUrl);
      // Verificar que sea http o https
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return null;
      }
      return trimmedUrl;
    } catch (e) {
      return null;
    }
  };

  // Auto-play video when videoData changes
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;

    const validatedUrl = validateVideoUrl(videoData?.videoUrl);

    if (validatedUrl) {
      setVideoError(false);
      setErrorDetails("");
      setCurrentVideoUrl(validatedUrl);

      video.pause();
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1.0;
      video.src = validatedUrl;
      video.load();

      const playTimeout = setTimeout(() => {
        video.play().catch((error) => {
          if (error.name !== 'NotAllowedError' &&
            error.name !== 'AbortError' &&
            error.name !== 'NotSupportedError') {
            console.warn("Error playing video:", error.name);
          }
        });
      }, 100);

      return () => {
        clearTimeout(playTimeout);
        video.pause();
        video.src = '';
        video.load();
      };
    } else {
      setVideoError(true);
      setErrorDetails(VIEW_COURSE_TEXTS.videoPlayer.errors.invalidVideo);
      setCurrentVideoUrl("");
      video.src = "";
    }
  }, [videoData]);

  // Reset error state when videoData changes
  useEffect(() => {
    setVideoError(false);
    setErrorDetails("");
  }, [videoData]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;

    let errorMessage: string = VIEW_COURSE_TEXTS.videoPlayer.errors.unknown;

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = VIEW_COURSE_TEXTS.videoPlayer.errors.aborted;
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = VIEW_COURSE_TEXTS.videoPlayer.errors.network;
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = VIEW_COURSE_TEXTS.videoPlayer.errors.decode;
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = VIEW_COURSE_TEXTS.videoPlayer.errors.notSupported;
          break;
        default:
          errorMessage = VIEW_COURSE_TEXTS.videoPlayer.errors.loadError(error.code);
      }
    }

    setVideoError(true);
    setErrorDetails(errorMessage);
  };

  const handleRetry = () => {
    setVideoError(false);
    setErrorDetails("");
    const video = videoElementRef.current;
    if (video) {
      const validatedUrl = validateVideoUrl(videoData?.videoUrl);
      if (validatedUrl) {
        setCurrentVideoUrl(validatedUrl);
        video.src = validatedUrl;
        video.load();
      } else {
        setVideoError(true);
        setErrorDetails(VIEW_COURSE_TEXTS.videoPlayer.errors.noValidVideo);
      }
    }
  };

  if (!videoData || !validateVideoUrl(videoData?.videoUrl)) {
    return null;
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-richblack-900 shadow-2xl border border-richblack-700">
      {videoError ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-richblack-800 text-richblack-400 rounded-xl p-6">
          <svg
            className="mb-4 h-16 w-16 opacity-50 text-yellow-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-center font-semibold text-lg mb-2">{VIEW_COURSE_TEXTS.videoPlayer.errorTitle}</p>
          <p className="mt-2 text-sm text-center text-richblack-300 max-w-md mb-4">
            {errorDetails || VIEW_COURSE_TEXTS.videoPlayer.errors.default}
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-100 transition-colors"
          >
            {VIEW_COURSE_TEXTS.videoPlayer.retry}
          </button>
        </div>
      ) : (
        <video
          ref={videoElementRef}
          src={currentVideoUrl || undefined}
          className="w-full h-full object-contain"
          controls={showControls}
          playsInline
          autoPlay
          muted={false}
          onPlay={() => {
            setShowControls(true);
            if (videoElementRef.current) {
              videoElementRef.current.muted = false;
              videoElementRef.current.volume = 1.0;
            }
          }}
          onLoadedMetadata={() => {
            if (videoElementRef.current) {
              videoElementRef.current.muted = false;
              videoElementRef.current.volume = 1.0;
            }
          }}
          onError={handleVideoError}
          onLoadStart={() => {
            if (videoError) {
              setVideoError(false);
              setErrorDetails("");
            }
          }}
        />
      )}

      {/* Custom overlay when video ends */}
      {videoEnded && (
        <div
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
          }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-4 p-6 rounded-xl"
        >
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white mb-2">{VIEW_COURSE_TEXTS.videoPlayer.videoCompleted}</h3>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {!isCompleted && (
                <button
                  disabled={loading}
                  onClick={onMarkComplete}
                  className="px-6 py-3 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                >
                  {!loading ? VIEW_COURSE_TEXTS.videoPlayer.markComplete : VIEW_COURSE_TEXTS.videoPlayer.loading}
                </button>
              )}
              <button
                disabled={loading}
                onClick={onRewatch}
                className="px-6 py-3 bg-richblack-700 text-richblack-5 font-semibold rounded-lg hover:bg-richblack-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] border border-richblack-600"
              >
                {VIEW_COURSE_TEXTS.videoPlayer.rewatch}
              </button>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center mt-6">
              <div className="flex gap-3 justify-center items-center">
                {!isFirst && (
                  <button
                    disabled={loading}
                    onClick={onPrev}
                    className="px-5 py-2.5 bg-richblack-700 text-richblack-5 font-medium rounded-lg hover:bg-richblack-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-richblack-600 flex items-center gap-2"
                  >
                    {VIEW_COURSE_TEXTS.videoPlayer.previous}
                  </button>
                )}
                {!isLast && (
                  <button
                    disabled={loading}
                    onClick={onNext}
                    className="px-5 py-2.5 bg-yellow-50 text-richblack-900 font-medium rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {VIEW_COURSE_TEXTS.videoPlayer.next}
                  </button>
                )}
              </div>

              {/* Información sobre la siguiente lecture/sección */}
              {!isLast && nextVideoInfo && (
                <div className="mt-2 px-4 py-2 bg-richblack-900/80 rounded-lg border border-richblack-700 max-w-md">
                  {nextVideoInfo.isNextSection ? (
                    <div className="text-center">
                      <p className="text-xs text-richblack-400 mb-1">
                        {VIEW_COURSE_TEXTS.videoPlayer.nextSection}
                      </p>
                      <p className="text-sm font-semibold text-yellow-200">
                        {nextVideoInfo.nextSectionName || VIEW_COURSE_TEXTS.videoPlayer.defaultNextSection}
                      </p>
                      {nextVideoInfo.nextLectureTitle && (
                        <p className="text-xs text-richblack-300 mt-1">
                          {nextVideoInfo.nextLectureTitle}
                        </p>
                      )}
                    </div>
                  ) : (
                    nextVideoInfo.nextLectureTitle && (
                      <div className="text-center">
                        <p className="text-xs text-richblack-400 mb-1">
                          {VIEW_COURSE_TEXTS.videoPlayer.nextLecture}
                        </p>
                        <p className="text-sm font-semibold text-yellow-200">
                          {nextVideoInfo.nextLectureTitle}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

"use client";

import React, { useRef, useEffect, useState } from "react";
import { VideoPlayerProps } from "../types";
import { VIEW_COURSE_TEXTS } from "../constants/viewCourse.constants";

/**
 * Detecta si una URL es de YouTube y retorna el video ID
 */
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/**
 * Detecta si una URL es de Vimeo y retorna { id, hash } donde hash es opcional
 */
const getVimeoInfo = (url: string): { id: string; hash?: string } | null => {
  // Soporta: vimeo.com/ID, vimeo.com/ID/HASH, player.vimeo.com/video/ID?h=HASH
  const patterns = [
    /vimeo\.com\/video\/([0-9]+)(?:.*[?&]h=([a-zA-Z0-9]+))?/,  // player embed URL
    /vimeo\.com\/([0-9]+)\/([a-zA-Z0-9]+)/,                      // private: vimeo.com/ID/HASH
    /vimeo\.com\/([0-9]+)/,                                        // public: vimeo.com/ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return { id: match[1], hash: match[2] };
  }
  return null;
};

/**
 * Convierte una URL de video en una URL de embed para iframe.
 * Retorna null si es una URL directa de archivo (mp4, etc.)
 */
const getEmbedUrl = (url: string): string | null => {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  }

  const vimeoInfo = getVimeoInfo(url);
  if (vimeoInfo) {
    const hashParam = vimeoInfo.hash ? `&h=${vimeoInfo.hash}` : "";
    return `https://player.vimeo.com/video/${vimeoInfo.id}?autoplay=1&title=0&byline=0&portrait=0${hashParam}`;
  }

  return null;
};

/**
 * Valida que sea una URL http/https válida
 */
const validateVideoUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
  try {
    const urlObj = new URL(trimmed);
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
};

/**
 * VideoPlayer - Renderiza videos de YouTube/Vimeo en un iframe,
 * o archivos directos con la etiqueta <video> nativa.
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
  const [videoError, setVideoError] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

  const validatedUrl = validateVideoUrl(videoData?.videoUrl);
  const embedUrl = validatedUrl ? getEmbedUrl(validatedUrl) : null;
  const isEmbedded = !!embedUrl;

  // Expose seek method (only works for native video, not iframe)
  useEffect(() => {
    if (playerRef) {
      playerRef.current = {
        seek: (time: number) => {
          if (videoElementRef.current) {
            videoElementRef.current.currentTime = time;
          }
        },
      };
    }
  }, [playerRef]);

  // Handle native video end event
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;
    const handleEnded = () => onVideoEnd();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [onVideoEnd]);

  // Update native video src when videoData changes
  useEffect(() => {
    if (!validatedUrl || isEmbedded) return;

    const video = videoElementRef.current;
    if (!video) return;

    setVideoError(false);
    setCurrentVideoUrl(validatedUrl);

    video.pause();
    video.currentTime = 0;
    video.src = validatedUrl;
    video.load();

    const timeout = setTimeout(() => {
      video.play().catch((err) => {
        if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
          console.warn("Error playing video:", err.name);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      video.pause();
      video.src = "";
    };
  }, [videoData, validatedUrl, isEmbedded]);

  const handleRetry = () => {
    setVideoError(false);
  };

  if (!videoData || !validatedUrl) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-richblack-900 shadow-2xl border border-richblack-700">

      {/* ——— IFRAME para YouTube / Vimeo ——— */}
      {isEmbedded && !videoError && (
        <iframe
          key={embedUrl!}
          src={embedUrl!}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={videoData.title || "Video"}
          onError={() => setVideoError(true)}
        />
      )}

      {/* ——— VIDEO nativo para archivos directos ——— */}
      {!isEmbedded && !videoError && (
        <video
          ref={videoElementRef}
          src={currentVideoUrl || undefined}
          className="w-full h-full object-contain"
          controls
          playsInline
          autoPlay
          onError={() => setVideoError(true)}
        />
      )}

      {/* ——— Estado de error ——— */}
      {videoError && (
        <div className="flex h-full w-full flex-col items-center justify-center bg-richblack-800 text-richblack-400 rounded-xl p-6">
          <svg className="mb-4 h-16 w-16 opacity-50 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-center font-semibold text-lg mb-2">{VIEW_COURSE_TEXTS.videoPlayer.errorTitle}</p>
          <p className="mt-2 text-sm text-center text-richblack-300 max-w-md mb-4">
            {VIEW_COURSE_TEXTS.videoPlayer.errors.default}
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-100 transition-colors"
          >
            {VIEW_COURSE_TEXTS.videoPlayer.retry}
          </button>
        </div>
      )}

      {/* ——— Overlay al terminar el video ——— */}
      {videoEnded && (
        <div
          style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.3))" }}
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

              {!isLast && nextVideoInfo && (
                <div className="mt-2 px-4 py-2 bg-richblack-900/80 rounded-lg border border-richblack-700 max-w-md">
                  {nextVideoInfo.isNextSection ? (
                    <div className="text-center">
                      <p className="text-xs text-richblack-400 mb-1">{VIEW_COURSE_TEXTS.videoPlayer.nextSection}</p>
                      <p className="text-sm font-semibold text-yellow-200">
                        {nextVideoInfo.nextSectionName || VIEW_COURSE_TEXTS.videoPlayer.defaultNextSection}
                      </p>
                      {nextVideoInfo.nextLectureTitle && (
                        <p className="text-xs text-richblack-300 mt-1">{nextVideoInfo.nextLectureTitle}</p>
                      )}
                    </div>
                  ) : (
                    nextVideoInfo.nextLectureTitle && (
                      <div className="text-center">
                        <p className="text-xs text-richblack-400 mb-1">{VIEW_COURSE_TEXTS.videoPlayer.nextLecture}</p>
                        <p className="text-sm font-semibold text-yellow-200">{nextVideoInfo.nextLectureTitle}</p>
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

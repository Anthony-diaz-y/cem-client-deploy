"use client";

import React, { useRef, useEffect, useState } from "react";
import { VideoPlayerProps } from "../types";

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

  // Auto-play video when videoData changes
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;

    if (videoData?.videoUrl) {
      // Validar que la URL sea válida
      let videoUrl = videoData.videoUrl.trim();
      
      // Verificar que sea una URL válida
      try {
        new URL(videoUrl);
      } catch (e) {
        console.error("Invalid video URL:", videoUrl);
        setVideoError(true);
        setErrorDetails("La URL del video no es válida");
        return;
      }

      console.log("Loading video:", {
        title: videoData.title,
        videoUrl: videoUrl,
        videoUrlLength: videoUrl?.length,
      });
      
      // Resetear error antes de cargar
      setVideoError(false);
      setErrorDetails("");
      
      // Cancelar cualquier reproducción anterior para evitar el error "interrupted by a new load request"
      video.pause();
      video.currentTime = 0;
      
      // Asegurar que el video no esté muteado
      video.muted = false;
      video.volume = 1.0;
      
      // Establecer la fuente del video
      video.src = videoUrl;
      
      // Cargar el video primero
      video.load();
      
      // Esperar un poco antes de intentar reproducir para evitar interrupciones
      const playTimeout = setTimeout(() => {
        // Intentar reproducir (puede fallar si el navegador requiere interacción del usuario)
        video.play().catch((error) => {
          // Ignorar errores de autoplay (son normales)
          if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
            console.error("Error playing video:", error);
          }
        });
      }, 100);

      return () => {
        clearTimeout(playTimeout);
        // Limpiar al desmontar o cambiar de video
        video.pause();
        video.src = '';
        video.load();
      };
    } else if (!videoData?.videoUrl) {
      console.warn("Video data exists but no videoUrl:", videoData);
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
    
    setVideoError(true);
    
    let errorMessage = "Error desconocido al cargar el video";
    
    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = "La carga del video fue cancelada";
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = "Error de red al cargar el video. Verifica tu conexión a internet.";
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = "Error al decodificar el video. El formato podría no ser compatible.";
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "El formato de video no es compatible o la URL no es válida.";
          break;
        default:
          errorMessage = `Error al cargar el video (código: ${error.code})`;
      }
    }
    
    setErrorDetails(errorMessage);
    console.error("Error loading video:", {
      url: videoData?.videoUrl,
      errorCode: error?.code,
      errorMessage: errorMessage,
      videoElement: video
    });
  };

  const handleRetry = () => {
    setVideoError(false);
    setErrorDetails("");
    const video = videoElementRef.current;
    if (video && videoData?.videoUrl) {
      video.load();
    }
  };

  if (!videoData) {
    return previewSource ? (
      <div className="h-full w-full rounded-md bg-richblack-800 flex items-center justify-center">
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
          onError={() => console.error("Error loading preview image")}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-richblack-900 bg-opacity-50">
          <p className="text-richblack-200">Cargando video...</p>
        </div>
      </div>
    ) : (
      <div className="h-full w-full rounded-md bg-richblack-800 flex items-center justify-center">
        <p className="text-richblack-400">No hay video disponible</p>
      </div>
    );
  }

  // Si no hay videoUrl, mostrar mensaje
  if (!videoData.videoUrl) {
    return (
      <div className="h-full w-full rounded-md bg-richblack-800 flex flex-col items-center justify-center">
        <svg
          className="mb-4 h-16 w-16 opacity-50 text-richblack-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="text-center text-richblack-400">No hay URL de video disponible</p>
        <p className="mt-2 text-sm text-center text-richblack-500">
          {videoData.title || "Esta lecture no tiene video"}
        </p>
      </div>
    );
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
          <p className="text-center font-semibold text-lg mb-2">Error al cargar el video</p>
          <p className="mt-2 text-sm text-center text-richblack-300 max-w-md mb-4">
            {errorDetails || "No se pudo cargar el video. Por favor, verifica la URL o tu conexión a internet."}
          </p>
          {videoData?.videoUrl && (
            <div className="text-xs text-richblack-500 mb-4 text-center max-w-md break-all">
              URL: {videoData.videoUrl}
            </div>
          )}
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-100 transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      ) : (
        <video
          ref={videoElementRef}
          src={videoData?.videoUrl}
          className="w-full h-full object-contain"
          controls={showControls}
          playsInline
          autoPlay
          muted={false}
          onPlay={() => {
            setShowControls(true);
            // Asegurar que el audio esté habilitado cuando el usuario interactúa
            if (videoElementRef.current) {
              videoElementRef.current.muted = false;
              // Forzar actualización del volumen
              videoElementRef.current.volume = 1.0;
            }
          }}
          onLoadedMetadata={() => {
            // Asegurar que el video no esté muteado cuando se carga
            if (videoElementRef.current) {
              videoElementRef.current.muted = false;
              videoElementRef.current.volume = 1.0;
            }
          }}
          onError={handleVideoError}
          onLoadStart={() => {
            // Resetear error cuando comienza a cargar
            if (videoError) {
              setVideoError(false);
              setErrorDetails("");
            }
          }}
        />
      )}

      {/* Custom overlay when video ends - Mejorado */}
      {videoEnded && (
        <div
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
          }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-4 p-6 rounded-xl"
        >
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white mb-2">¡Video Completado!</h3>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {!isCompleted && (
                <button
                  disabled={loading}
                  onClick={onMarkComplete}
                  className="px-6 py-3 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                >
                  {!loading ? "✓ Marcar como Completado" : "Cargando..."}
                </button>
              )}
              <button
                disabled={loading}
                onClick={onRewatch}
                className="px-6 py-3 bg-richblack-700 text-richblack-5 font-semibold rounded-lg hover:bg-richblack-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] border border-richblack-600"
              >
                🔄 Volver a Ver
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
                    <span>←</span> Anterior
                  </button>
                )}
                {!isLast && (
                  <button
                    disabled={loading}
                    onClick={onNext}
                    className="px-5 py-2.5 bg-yellow-50 text-richblack-900 font-medium rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Siguiente <span>→</span>
                  </button>
                )}
              </div>
              
              {/* Información sobre la siguiente lecture/sección */}
              {!isLast && nextVideoInfo && (
                <div className="mt-2 px-4 py-2 bg-richblack-900/80 rounded-lg border border-richblack-700 max-w-md">
                  {nextVideoInfo.isNextSection ? (
                    <div className="text-center">
                      <p className="text-xs text-richblack-400 mb-1">
                        Continúa en la siguiente sección:
                      </p>
                      <p className="text-sm font-semibold text-yellow-200">
                        {nextVideoInfo.nextSectionName || "Siguiente Sección"}
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
                          Siguiente lecture:
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

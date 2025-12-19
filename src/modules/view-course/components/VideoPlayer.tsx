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
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  // URL de video de prueba como fallback
  const FALLBACK_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

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

    // Validar videoUrl
    const validatedUrl = validateVideoUrl(videoData?.videoUrl);
    
    if (validatedUrl) {
      // Logging solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log("Loading video:", {
          title: videoData?.title,
          videoUrl: validatedUrl,
        });
      }
      
      // Resetear estados de error y fallback
      setVideoError(false);
      setErrorDetails("");
      setIsUsingFallback(false);
      setCurrentVideoUrl(validatedUrl);
      
      // Cancelar cualquier reproducción anterior
      video.pause();
      video.currentTime = 0;
      
      // Asegurar que el video no esté muteado
      video.muted = false;
      video.volume = 1.0;
      
      // Establecer la fuente del video
      video.src = validatedUrl;
      
      // Cargar el video primero
      video.load();
      
      // Esperar un poco antes de intentar reproducir
      const playTimeout = setTimeout(() => {
        video.play().catch((error) => {
          // Ignorar errores de autoplay (son normales)
          // También ignorar NotSupportedError ya que será manejado por onError
          if (error.name !== 'NotAllowedError' && 
              error.name !== 'AbortError' && 
              error.name !== 'NotSupportedError') {
            if (process.env.NODE_ENV === 'development') {
              console.warn("Error playing video:", {
                errorName: error.name,
                errorMessage: error.message,
              });
            }
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
      // Si no hay URL válida, usar fallback inmediatamente
      if (process.env.NODE_ENV === 'development') {
        console.warn("Invalid or missing videoUrl, using fallback:", {
          originalUrl: videoData?.videoUrl,
          title: videoData?.title,
        });
      }
      
      setCurrentVideoUrl(FALLBACK_VIDEO_URL);
      setIsUsingFallback(true);
      setVideoError(false);
      setErrorDetails("URL de video no válida. Usando video de prueba.");
      
      video.pause();
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1.0;
      video.src = FALLBACK_VIDEO_URL;
      
      // Usar eventos del video para saber cuándo está listo
      const handleCanPlay = () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleFallbackError);
        
        video.play().catch((error) => {
          // Ignorar errores de autoplay
          if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
            if (process.env.NODE_ENV === 'development') {
              console.warn("Error playing fallback video:", {
                errorName: error.name,
                errorMessage: error.message,
              });
            }
          }
        });
      };
      
      const handleFallbackError = () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleFallbackError);
        // El onError del video element manejará este caso
      };
      
      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('error', handleFallbackError, { once: true });
      
      video.load();
    }
  }, [videoData, FALLBACK_VIDEO_URL]);

  // Reset error state when videoData changes
  useEffect(() => {
    setVideoError(false);
    setErrorDetails("");
  }, [videoData]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    // Capturar información básica primero
    const originalUrl = currentVideoUrl || video.src || videoData?.videoUrl || "N/A";
    const videoTitle = videoData?.title || "N/A";
    const videoSrc = video.src || "N/A";
    const videoCurrentSrc = video.currentSrc || "N/A";
    const networkState = video.networkState;
    const readyState = video.readyState;
    
    let errorMessage = "Error desconocido al cargar el video";
    let errorCode: number | null = null;
    let errorName: string | null = null;
    
    // Capturar información del error de manera más robusta
    if (error) {
      errorCode = error.code;
      errorName = error.name || null;
      
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
    } else {
      // Si no hay objeto de error pero hay un NotSupportedError en la consola
      // o el networkState indica problema, usar mensaje apropiado
      if (networkState === 3) { // NETWORK_NO_SOURCE
        errorMessage = "No se encontró una fuente de video compatible. El formato podría no ser soportado.";
        errorName = "NotSupportedError";
      } else {
        errorMessage = "Error desconocido al cargar el video. El video no pudo cargarse.";
      }
    }
    
    // Si no estamos usando fallback y el video original falla, intentar con fallback
    if (!isUsingFallback && originalUrl !== FALLBACK_VIDEO_URL) {
      // Logging solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.warn("Error loading original video, switching to fallback", {
          originalUrl,
          videoTitle,
          errorCode: errorCode !== null ? errorCode : "N/A",
          errorName: errorName || "N/A",
          errorMessage,
          networkState,
          readyState,
        });
      }
      
      // Cambiar a video de prueba
      setIsUsingFallback(true);
      setCurrentVideoUrl(FALLBACK_VIDEO_URL);
      setErrorDetails("Error al cargar el video original. Usando video de prueba.");
      setVideoError(false);
      
      // Limpiar completamente el video antes de cargar el fallback
      video.pause();
      video.removeAttribute('src');
      video.load();
      
      // Esperar un momento antes de cargar el fallback para asegurar limpieza completa
      const fallbackTimeout = setTimeout(() => {
        // Limpiar cualquier error previo
        if (video.error) {
          video.load();
        }
        
        video.src = FALLBACK_VIDEO_URL;
        video.currentTime = 0;
        video.muted = false;
        video.volume = 1.0;
        
        // Usar eventos del video para saber cuándo está listo
        const handleCanPlay = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleFallbackError);
          
          // Intentar reproducir solo cuando el video esté listo
          video.play().catch((playError) => {
            // Ignorar errores de autoplay (son normales)
            if (playError.name !== 'NotAllowedError' && playError.name !== 'AbortError') {
              if (process.env.NODE_ENV === 'development') {
                console.warn("Error playing fallback video:", {
                  errorName: playError.name,
                  errorMessage: playError.message,
                });
              }
            }
          });
        };
        
        const handleFallbackError = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleFallbackError);
          // El onError del video element manejará este caso
        };
        
        video.addEventListener('canplay', handleCanPlay, { once: true });
        video.addEventListener('error', handleFallbackError, { once: true });
        
        video.load();
      }, 150);
      
      // Guardar el timeout para limpieza
      (video as any)._fallbackTimeout = fallbackTimeout;
    } else {
      // Si ya estamos usando fallback y falla, mostrar error
      setVideoError(true);
      setErrorDetails(errorMessage || "No se pudo cargar ningún video. Por favor, verifica tu conexión a internet.");
      
      // Logging solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error("Error loading video (fallback also failed)", {
          currentUrl: currentVideoUrl || "N/A",
          isUsingFallback,
          videoTitle,
          errorCode: errorCode !== null ? errorCode : "N/A",
          errorName: errorName || "N/A",
          errorMessage,
          networkState,
          readyState,
        });
      }
    }
  };

  const handleRetry = () => {
    setVideoError(false);
    setErrorDetails("");
    setIsUsingFallback(false);
    const video = videoElementRef.current;
    if (video) {
      // Intentar con la URL original primero
      const validatedUrl = validateVideoUrl(videoData?.videoUrl);
      if (validatedUrl) {
        setCurrentVideoUrl(validatedUrl);
        video.src = validatedUrl;
      } else {
        // Si no hay URL válida, usar fallback
        setCurrentVideoUrl(FALLBACK_VIDEO_URL);
        setIsUsingFallback(true);
        video.src = FALLBACK_VIDEO_URL;
      }
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

  // Si no hay videoUrl válido, usar fallback automáticamente
  const validatedUrl = validateVideoUrl(videoData?.videoUrl);
  if (!validatedUrl && !currentVideoUrl) {
    // Si no hay URL válida y aún no hemos establecido una, usar fallback
    if (videoElementRef.current && !isUsingFallback) {
      setIsUsingFallback(true);
      setCurrentVideoUrl(FALLBACK_VIDEO_URL);
      setErrorDetails("URL de video no válida. Usando video de prueba.");
      const video = videoElementRef.current;
      video.src = FALLBACK_VIDEO_URL;
      video.load();
    }
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
          {isUsingFallback && (
            <div className="text-xs text-yellow-200 mb-2 text-center max-w-md">
              ⚠️ Usando video de prueba
            </div>
          )}
          {currentVideoUrl && (
            <div className="text-xs text-richblack-500 mb-4 text-center max-w-md break-all">
              URL actual: {currentVideoUrl}
            </div>
          )}
          {videoData?.videoUrl && videoData.videoUrl !== currentVideoUrl && (
            <div className="text-xs text-richblack-600 mb-2 text-center max-w-md break-all">
              URL original: {videoData.videoUrl}
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
        <>
          <video
            ref={videoElementRef}
            src={currentVideoUrl || validatedUrl || FALLBACK_VIDEO_URL}
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
          {isUsingFallback && (
            <div className="absolute top-4 right-4 bg-yellow-50/90 text-richblack-900 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg">
              ⚠️ Video de prueba
            </div>
          )}
        </>
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

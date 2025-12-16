'use client'

import React, { useRef, useEffect, useState } from "react"
import { SubSection } from "../types"

interface VideoPlayerProps {
  videoData: SubSection | null
  previewSource: string
  videoEnded: boolean
  playerRef: React.RefObject<{ seek: (time: number) => void } | null>
  onVideoEnd: () => void
  onMarkComplete: () => void
  onRewatch: () => void
  onNext: () => void
  onPrev: () => void
  loading: boolean
  isCompleted: boolean
  isFirst: boolean
  isLast: boolean
}

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
}) => {
  const videoElementRef = useRef<HTMLVideoElement>(null)
  const [showControls, setShowControls] = useState(true)

  // Expose seek method to parent component via ref
  useEffect(() => {
    if (playerRef && videoElementRef.current) {
      playerRef.current = {
        seek: (time: number) => {
          if (videoElementRef.current) {
            videoElementRef.current.currentTime = time
          }
        },
      }
    }
  }, [playerRef])

  // Handle video end
  useEffect(() => {
    const video = videoElementRef.current
    if (!video) return

    const handleEnded = () => {
      onVideoEnd()
    }

    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('ended', handleEnded)
    }
  }, [onVideoEnd])

  // Auto-play video when videoData changes
  useEffect(() => {
    if (videoElementRef.current && videoData?.videoUrl) {
      videoElementRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }, [videoData])

  if (!videoData) {
    return previewSource ? (
      <div className="h-full w-full rounded-md bg-richblack-800 flex items-center justify-center">
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      </div>
    ) : (
      <div className="h-full w-full rounded-md bg-richblack-800 flex items-center justify-center">
        <p className="text-richblack-400">No preview available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-richblack-900">
      <video
        ref={videoElementRef}
        src={videoData?.videoUrl}
        className="w-full h-full"
        controls={showControls}
        playsInline
        autoPlay
        onPlay={() => setShowControls(true)}
      />

      {/* Custom overlay when video ends */}
      {videoEnded && (
        <div
          style={{
            backgroundImage:
              "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
          }}
          className="absolute inset-0 z-[100] grid h-full place-content-center font-inter"
        >
          {!isCompleted && (
            <button
              disabled={loading}
              onClick={onMarkComplete}
              className="text-xl max-w-max px-4 mx-auto blackButton"
            >
              {!loading ? "Mark As Completed" : "Loading..."}
            </button>
          )}
          <button
            disabled={loading}
            onClick={onRewatch}
            className="text-xl max-w-max px-4 mx-auto mt-2 blackButton"
          >
            Rewatch
          </button>

          <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
            {!isFirst && (
              <button
                disabled={loading}
                onClick={onPrev}
                className="blackButton"
              >
                Prev
              </button>
            )}
            {!isLast && (
              <button
                disabled={loading}
                onClick={onNext}
                className="blackButton"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer


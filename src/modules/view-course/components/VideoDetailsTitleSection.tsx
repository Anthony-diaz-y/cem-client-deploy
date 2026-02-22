"use client";

import React from "react";
import { VIEW_COURSE_TEXTS } from "../constants/viewCourse.constants";

interface VideoDetailsTitleSectionProps {
  title: string | undefined;
  timeDuration?: string | number;
  isCompleted: boolean;
}

export function VideoDetailsTitleSection({
  title,
  timeDuration,
  isCompleted,
}: VideoDetailsTitleSectionProps) {
  if (!title && !timeDuration && !isCompleted) return null;

  const formattedDuration = (() => {
    if (!timeDuration) return "";
    const duration =
      typeof timeDuration === "string"
        ? parseFloat(timeDuration)
        : timeDuration;
    if (!duration) return "";
    const seconds = Math.round(duration);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  })();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-richblack-5 mb-3">
        {title || VIEW_COURSE_TEXTS.videoDetails.noTitle}
      </h1>
      <div className="border-b border-richblack-700 pb-3 mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-richblack-400">
          {formattedDuration && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{formattedDuration}</span>
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-yellow-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-yellow-200 font-medium">
                {VIEW_COURSE_TEXTS.videoDetails.completed}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

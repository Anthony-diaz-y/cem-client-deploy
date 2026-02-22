"use client";

import React from "react";
import {
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFile,
} from "react-icons/ai";
import { VIEW_COURSE_TEXTS } from "../constants/viewCourse.constants";

interface Attachment {
  url: string;
  name: string;
  type: string;
}

interface VideoAttachmentsSectionProps {
  attachments: Attachment[];
}

function getAttachmentIcon(type: string) {
  if (type.includes("pdf"))
    return <AiOutlineFilePdf className="text-pink-200 text-2xl" />;
  if (
    type.includes("word") ||
    type.includes("officedocument.wordprocessingml")
  )
    return <AiOutlineFileWord className="text-blue-200 text-2xl" />;
  if (
    type.includes("excel") ||
    type.includes("officedocument.spreadsheetml")
  )
    return <AiOutlineFileExcel className="text-caribbeangreen-200 text-2xl" />;
  return <AiOutlineFile className="text-richblack-200 text-2xl" />;
}

export function VideoAttachmentsSection({ attachments }: VideoAttachmentsSectionProps) {
  if (!attachments.length) return null;

  return (
    <div className="bg-richblack-800/50 backdrop-blur-sm rounded-2xl p-8 border border-richblack-700/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full" />
        <h2 className="text-lg font-semibold text-richblack-5 tracking-wide">
          {VIEW_COURSE_TEXTS.videoDetails.attachments.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {attachments.map((attachment, index) => (
          <a
            key={index}
            href={attachment.url}
            download={attachment.name}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 bg-richblack-700/50 hover:bg-richblack-700 border border-richblack-600/50 hover:border-richblack-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-richblack-800 rounded-lg group-hover:bg-richblack-900 transition-colors">
              {getAttachmentIcon(attachment.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-richblack-5 font-medium text-base truncate group-hover:text-yellow-50 transition-colors">
                {attachment.name}
              </p>
              <p className="text-richblack-400 text-sm mt-1">
                {attachment.type.split("/")[1]?.toUpperCase() ||
                  VIEW_COURSE_TEXTS.videoDetails.attachments.fileType}
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-richblack-400 group-hover:text-yellow-50 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CourseInfoSectionProps } from "../../types";
import { COURSE_TEXTS } from "../../constants/course.constants";

/**
 * CourseInfoSection - Section for course information
 * Displays what you'll learn (benefits) and tags
 */
const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({
    whatYouWillLearn,
    tag,
}) => {
    // Use only tags from the "Etiquetas" field
    const allTags = tag || [];

    return (
        <div className="mb-0">
            {/* Header: ¿Por qué llevar el curso? */}
            <div className="mb-8">
                <h2 className="text-[28px] font-bold text-cem-neutral-gray-900 mb-6">
                    {COURSE_TEXTS.infoSection.whatYouWillLearn}
                </h2>
                <div className="space-y-4 text-cem-neutral-gray-700 leading-relaxed text-[16px]">
                    {whatYouWillLearn ? (
                        whatYouWillLearn
                            .split("\n")
                            .map((line, index) => line.trim() && <p key={index}>{line}</p>)
                    ) : (
                        <p>No hay información disponible.</p>
                    )}
                </div>
            </div>

            {/* Labels Section: Etiquetas */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mb-12">
                    <span className="text-cem-neutral-gray-900 font-bold text-lg mr-1">
                        {COURSE_TEXTS.infoSection.tags}
                    </span>
                    {allTags.map((t, ind) => {
                        const colors = [
                            "bg-pink-100/50 text-pink-500",
                            "bg-green-100/50 text-green-500",
                            "bg-blue-100/50 text-blue-500",
                            "bg-purple-100/50 text-purple-500",
                        ];
                        const colorClass = colors[ind % colors.length];

                        return (
                            <span
                                key={ind}
                                className={`px-4 py-1 rounded-full text-[13px] font-medium transition-all duration-300 hover:scale-105 ${colorClass}`}
                            >
                                {t}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CourseInfoSection;

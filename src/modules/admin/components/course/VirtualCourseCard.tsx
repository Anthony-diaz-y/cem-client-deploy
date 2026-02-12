"use client";

import React, { useState, useEffect, useRef } from "react";
import CourseCard from "./CourseCard";
import { AdminCourse } from "@shared/services/adminAPI";

interface VirtualCourseCardProps {
    course: AdminCourse;
    onPublishClick: (course: AdminCourse) => void;
    onUnpublishClick: (course: AdminCourse) => void;
    onDeleteClick: (course: AdminCourse) => void;
}

/**
 * Wrapper for CourseCard that "virtualizes" the content.
 * It renders a placeholder when the card is far from the viewport.
 */
export default function VirtualCourseCard(props: VirtualCourseCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // We use a rootMargin to start rendering before it enters the viewport
                setIsVisible(entry.isIntersecting);
            },
            {
                rootMargin: "400px 0px", // Precargar 400px antes de entrar
                threshold: 0.01,
            }
        );

        const currentContainer = containerRef.current;
        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-[580px] w-full transition-opacity duration-500"
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            {isVisible ? (
                <CourseCard {...props} />
            ) : (
                // Placeholder to maintain layout and scroll height
                <div className="w-full h-full bg-cem-neutral-gray-50/30 rounded-[24px] border border-dashed border-cem-neutral-gray-100 animate-pulse" />
            )}
        </div>
    );
}

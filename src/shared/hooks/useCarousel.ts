import { useRef, useState, MouseEvent } from "react";

/**
 * Custom hook to handle carousel scroll and drag logic
 */
export const useCarousel = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        // PageX gives the position relative to the document
        // offsetLeft gives the position of the container relative to its parent
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        // The * 2 determines the scroll speed
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return {
        scrollRef,
        isDragging,
        handleMouseDown,
        handleMouseLeave,
        handleMouseUp,
        handleMouseMove,
    };
};

import React, { useRef, useState } from "react";
import { RatingStars } from "@shared/components";
import { TESTIMONIALS } from "../constants/about.constants";

const AboutTestimonials = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section className="flex flex-col items-center justify-center py-16 md:py-16 bg-[#D8E9EB] overflow-hidden">
            <div className="text-center mb-12 ">
                <h3 className="text-[12px] md:text-[14px] font-bold text-[#3B6E71] uppercase tracking-[0.3em] mb-4">Testimonios</h3>
                <h2 className="text-[32px] md:text-[42px] font-bold text-[#1D2939] leading-[1.2] max-w-[300px] md:max-w-none mx-auto">Autoridades nos recomiendan</h2>
            </div>

            <div className="relative w-full max-w-[1440px] mx-auto">
                {/* Gradients for desktop */}
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#D8E9EB] to-transparent z-10 pointer-events-none" />
                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#D8E9EB] to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex overflow-x-auto gap-6 px-6 md:px-6 lg:px-28 pb-10 no-scrollbar cursor-grab active:cursor-grabbing ${!isDragging ? "snap-x snap-mandatory" : ""}`}
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}} />
                    {TESTIMONIALS.map((testi, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[88%] md:w-[402px] md:h-[354.5px] bg-white rounded-[40px] p-8 md:p-10 flex flex-col gap-6 shadow-sm snap-center select-none"
                        >
                            <div className="pointer-events-none">
                                <RatingStars Review_Count={testi.rating} Star_Size={20} />
                            </div>
                            <p className="text-[#475467] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] pointer-events-none">
                                {testi.text}
                            </p>
                            <div className="flex items-center gap-4 mt-auto pointer-events-none">
                                <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                    MW
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#101828] text-[18px]">{testi.name}</h4>
                                    <p className="text-[#667085] text-sm">{testi.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutTestimonials;

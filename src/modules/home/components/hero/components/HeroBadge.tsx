import React from "react";
import Image, { StaticImageData } from "next/image";

interface HeroBadgeProps {
    position: "top-left" | "top-right" | "bottom-right";
    value: string;
    label: string;
    imageSrc: StaticImageData;
}

export const HeroBadge: React.FC<HeroBadgeProps> = ({
    position,
    value,
    label,
    imageSrc,
}) => {
    const positionClasses = {
        "top-left":
            "top-24 -left-8 min-[380px]:top-28 min-[380px]:-left-6 sm:-left-16 md:top-32 md:-left-24 lg:top-52 lg:-left-12",
        "top-right":
            "-top-2 -right-4 min-[380px]:-top-2 min-[380px]:-right-6 sm:-right-12 md:-top-8 md:-right-8 lg:-top-4 lg:-right-4",
        "bottom-right":
            "bottom-4 -right-4 min-[380px]:bottom-8 min-[380px]:-right-6 sm:-right-12 md:bottom-12 md:-right-16 lg:bottom-16 lg:-right-4",
    };

    const isVertical = position === "top-right";

    return (
        <div
            className={`absolute ${positionClasses[position]} bg-white rounded-xl md:rounded-2xl p-2 min-[380px]:p-3 md:p-4 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3)] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] border-[1.3px] border-cem-primary z-20 transition-transform duration-300 hover:scale-105 ${isVertical ? "min-w-[90px] min-[380px]:min-w-[100px] md:min-w-[120px]" : "flex items-center gap-2 min-[380px]:gap-3 md:gap-4 pr-4 min-[380px]:pr-6 md:pr-8"}`}
        >
            <div
                className={`relative flex-shrink-0 ${isVertical ? "w-10 h-10 min-[380px]:w-12 min-[380px]:h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3" : "w-8 h-8 min-[380px]:w-10 min-[380px]:h-10 md:w-14 md:h-14"}`}
            >
                <Image src={imageSrc} alt="icon" fill className="object-contain" />
            </div>

            <div className={` ${isVertical ? "text-center" : ""}`}>
                {position === "top-right" && (
                    <>
                        <p className="text-xl md:text-3xl font-bold text-gray-900 leading-none">
                            {value}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 whitespace-nowrap">
                            {label}
                        </p>
                    </>
                )}

                {position === "top-left" && (
                    <>
                        <p className="text-xl md:text-3xl font-bold text-gray-900 leading-none">
                            {value}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                            {label}
                        </p>
                    </>
                )}

                {position === "bottom-right" && (
                    <div className="flex flex-col">
                        <p className="text-xs md:text-sm text-gray-500 leading-tight mb-0.5 md:mb-1">
                            {label}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                            {value}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

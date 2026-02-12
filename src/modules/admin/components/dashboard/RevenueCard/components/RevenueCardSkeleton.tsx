import React from "react";

export const RevenueCardSkeleton = () => {
    return (
        <div className="bg-gradient-to-br from-cem-primary to-[#036d85] rounded-xl px-8 py-4 animate-pulse shadow-sm h-full w-full flex flex-col justify-between relative overflow-hidden min-h-[95px]">
            {/* Placeholder para el icono de moneda */}
            <div className="absolute top-0 right-5 mt-1.5 opacity-20">
                <div className="w-20 h-20 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-white/40 rounded w-2/3"></div>
                </div>
                <div className="h-3 bg-white/20 rounded w-3/4 mt-4"></div>
            </div>
        </div>
    );
};

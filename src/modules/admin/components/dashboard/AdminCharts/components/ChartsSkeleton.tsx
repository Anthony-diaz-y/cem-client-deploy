import React from "react";

export const ChartsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            {/* Gráfico 1: Skeleton */}
            <div className="lg:col-span-5 bg-white px-5 pt-8 pb-10 rounded-2xl border border-cem-neutral-gray-100 shadow-sm flex flex-col min-h-[365px]">
                <div className="h-6 bg-cem-neutral-gray-100 rounded w-1/2 mb-4 animate-pulse"></div>
                <div className="space-y-[1rem] flex-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="flex justify-between mb-1.5">
                                <div className="h-2.5 bg-cem-neutral-gray-50 rounded w-1/3"></div>
                                <div className="h-2.5 bg-cem-neutral-gray-50 rounded w-10"></div>
                            </div>
                            <div className="h-2 bg-cem-neutral-gray-50 rounded-full w-full"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gráfico 2: Skeleton */}
            <div className="lg:col-span-7 bg-white px-5 pt-8 pb-10 rounded-2xl border border-cem-neutral-gray-100 shadow-sm min-h-[365px]">
                <div className="h-6 bg-cem-neutral-gray-100 rounded w-1/3 mb-6 animate-pulse"></div>
                <div className="flex flex-col md:flex-row items-center gap-4 h-[240px]">
                    {/* Doughnut Skeleton */}
                    <div className="w-[150px] h-[150px] rounded-full border-[18px] border-cem-neutral-gray-50 animate-pulse flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-4 bg-cem-neutral-gray-100/50 rounded"></div>
                            <div className="w-8 h-2 bg-cem-neutral-gray-50 rounded"></div>
                        </div>
                    </div>
                    {/* Legend Skeleton */}
                    <div className="flex-1 space-y-[0.6rem] w-full flex flex-col justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-4 bg-cem-neutral-gray-50 rounded-md"></div>
                                    <div className="h-2.5 bg-cem-neutral-gray-50 rounded w-20"></div>
                                </div>
                                <div className="w-16 h-2 bg-cem-neutral-gray-50 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

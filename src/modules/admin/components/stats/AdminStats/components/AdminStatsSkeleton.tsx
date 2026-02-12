import React from "react";

export const AdminStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full h-full flex-1">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-[#EBF9FF] rounded-2xl px-6 py-4 border border-[#D0EFFF] animate-pulse shadow-sm flex flex-col justify-between h-full min-h-[80px]"
                >
                    <div className="h-4 bg-cem-neutral-gray-200/40 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-[#00849c]/20 rounded w-1/3"></div>
                </div>
            ))}
        </div>
    );
};

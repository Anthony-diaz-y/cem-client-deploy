import React from "react";
import CountUp from "@shared/components/ui/CountUp";

export interface StatCardProps {
    title: string;
    value: number;
    highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div
            className="rounded-2xl px-6 py-4 transition-all hover:shadow-md hover:-translate-y-1 shadow-sm flex flex-col justify-between bg-[#EBF9FF] border border-[#D0EFFF] w-full h-full"
        >
            <div>
                <p className="text-sm font-medium text-cem-neutral-gray-600 mb-2">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-[#00849c]">
                        <CountUp end={value} duration={2} />
                    </p>
                </div>
            </div>
        </div>
    );
};

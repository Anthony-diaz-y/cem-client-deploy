"use client";

import React from "react";
import { AdminChartsProps } from "./interfaces/AdminCharts.interface";
import { ChartsSkeleton } from "./components/ChartsSkeleton";
import { PopularCoursesChart } from "./components/PopularCoursesChart";
import { UserDistributionChart } from "./components/UserDistributionChart";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

// Register ChartJS defaults globally for this component scope if needed
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminCharts({ charts, loading }: AdminChartsProps) {
    if (loading) {
        return <ChartsSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            <PopularCoursesChart charts={charts} />
            <UserDistributionChart charts={charts} />
        </div>
    );
}

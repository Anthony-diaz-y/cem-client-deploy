import React from "react";
import { Doughnut } from "react-chartjs-2";
import { AdminDashboardCharts } from "@shared/services/admin/types";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    TooltipItem
} from "chart.js";

// Register ChartJS components locally for this chart
ChartJS.register(ArcElement, Tooltip, Legend);

interface UserDistributionChartProps {
    charts: AdminDashboardCharts;
}

export const UserDistributionChart: React.FC<UserDistributionChartProps> = ({ charts }) => {
    const revenueColors = [
        "#006d82", // Darkest Teal
        "#00849c", // Main Teal
        "#22a6bf", // Lighter Teal
        "#82cddb", // Pale Blue
        "#cbd5e1", // Light Gray
    ];

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // Disable default legend
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            }
        },
        cutout: '75%', // Thinner ring
    };

    const totalStudentsInTop = charts.topCoursesByStudents.reduce((acc, curr) => acc + curr.studentsCount, 0);

    return (
        <div className="lg:col-span-7 bg-white px-5 pt-8 pb-10 rounded-[2rem] border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-cem-neutral-gray-900 mb-4">
                Distribución de Usuarios
            </h3>

            {charts.topCoursesByStudents.length > 0 ? (
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 h-[285px]">
                    {/* Chart Container */}
                    <div className="relative w-full md:w-[40%] h-[225px] md:h-full flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: charts.topCoursesByStudents.map(c => c.courseName),
                                datasets: [{
                                    data: charts.topCoursesByStudents.map(c => c.studentsCount),
                                    backgroundColor: revenueColors,
                                    borderWidth: 0,
                                    hoverOffset: 4,
                                }]
                            }}
                            options={{
                                ...revenueChartOptions,
                                plugins: {
                                    ...revenueChartOptions.plugins,
                                    tooltip: {
                                        ...revenueChartOptions.plugins.tooltip,
                                        callbacks: {
                                            label: function (context: TooltipItem<"doughnut">) {
                                                return `${context.parsed} employees`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-[#006d82]">{totalStudentsInTop}</span>
                            <span className="text-xs font-bold text-cem-neutral-gray-400 uppercase tracking-widest">Inscritos</span>
                        </div>
                    </div>

                    {/* Custom Legend */}
                    <div className="w-full md:w-[60%] space-y-4 overflow-y-auto max-h-[310px] pl-2 pr-2 custom-scrollbar flex flex-col justify-center">
                        {charts.topCoursesByStudents.map((course, idx) => {
                            const percentage = totalStudentsInTop > 0 ? Math.round((course.studentsCount / totalStudentsInTop) * 100) : 0;
                            const color = revenueColors[idx % revenueColors.length];

                            return (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span
                                            className="px-2 py-1 rounded-md text-[10px] font-bold text-white min-w-[2.75rem] text-center transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: color }}
                                        >
                                            {percentage}%
                                        </span>
                                        <span className="text-xs font-medium text-cem-neutral-gray-600 truncate group-hover:text-cem-primary transition-colors" title={course.courseName}>
                                            {course.courseName}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-cem-neutral-gray-400 ml-2 whitespace-nowrap">
                                        {course.studentsCount} {course.studentsCount === 1 ? 'employee' : 'employees'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="h-[300px] flex items-center justify-center">
                    <p className="text-cem-neutral-gray-400 font-medium">No hay datos disponibles</p>
                </div>
            )}
        </div>
    );
};

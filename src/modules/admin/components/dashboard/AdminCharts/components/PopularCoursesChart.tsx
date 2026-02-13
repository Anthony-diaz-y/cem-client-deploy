import React, { useMemo } from "react";
import { AdminDashboardCharts } from "@shared/services/admin/types";

interface PopularCoursesChartProps {
    charts: AdminDashboardCharts;
}

export const PopularCoursesChart: React.FC<PopularCoursesChartProps> = ({ charts }) => {
    const totalStudentsInTop = useMemo(() => {
        return charts.topCoursesByStudents.reduce((acc, curr) => acc + curr.studentsCount, 0);
    }, [charts.topCoursesByStudents]);

    const maxStudents = useMemo(() => {
        return Math.max(...charts.topCoursesByStudents.map(c => c.studentsCount), 1);
    }, [charts.topCoursesByStudents]);

    return (
        <div className="lg:col-span-5 bg-white px-5 pt-8 pb-10 rounded-2xl border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <h3 className="text-lg font-semibold text-cem-neutral-gray-900 mb-4">
                Cursos más Populares
            </h3>

            <div className="flex-1 relative min-h-[285px]">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
                    {[0, 25, 50, 75, 100].map((tick) => (
                        <div key={tick} className="h-full border-l border-dashed border-cem-neutral-gray-100 relative">
                        </div>
                    ))}
                </div>

                {/* Bars Container */}
                <div className="relative z-10 space-y-[1.6rem]">
                    {charts.topCoursesByStudents.length > 0 ? (
                        charts.topCoursesByStudents.slice(0, 5).map((course, idx) => {
                            const percentage = totalStudentsInTop > 0
                                ? ((course.studentsCount / totalStudentsInTop) * 100).toFixed(1)
                                : "0";

                            // Width for the bar (relative to the max value for better scaling)
                            const barWidth = (course.studentsCount / maxStudents) * 100;

                            return (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-cem-neutral-gray-500 truncate pr-4">
                                            {course.courseName}
                                        </span>
                                        <div className="text-[10px] font-bold text-cem-neutral-gray-400">
                                            <span className="text-cem-neutral-gray-400">{percentage}%</span>
                                            <span className="mx-1.5 opacity-30">|</span>
                                            <span className="text-cem-neutral-gray-900">{course.studentsCount}</span>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full bg-cem-neutral-gray-100/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#00849c] rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${barWidth}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-cem-neutral-gray-400 font-medium">No hay datos disponibles</p>
                        </div>
                    )}
                </div>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-2 left-0 right-0 flex justify-between text-[10px] font-bold text-cem-neutral-gray-400 px-0 translate-y-full">
                    {[0, 25, 50, 75, 100].map((tick) => (
                        <span key={tick} className="-translate-x-1/2 first:translate-x-0 last:-translate-x-full">
                            {tick}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

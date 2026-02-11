"use client";

import React from "react";
import { AdminDashboardCharts } from "@shared/services/admin/types";
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
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdminChartsProps {
  charts: AdminDashboardCharts;
}

export default function AdminCharts({ charts }: AdminChartsProps) {
  // --- CUSTOM BAR CHART LOGIC (Cursos más Populares) ---
  const totalStudentsInTop = charts.topCoursesByStudents.reduce((acc, curr) => acc + curr.studentsCount, 0);
  const maxStudents = Math.max(...charts.topCoursesByStudents.map(c => c.studentsCount), 1);

  // --- DOUGHNUT CHART CONFIGURATION ---
  const revenueColors = [
    "#006d82", // Darkest Teal
    "#00849c", // Main Teal
    "#22a6bf", // Lighter Teal
    "#82cddb", // Pale Blue
    "#cbd5e1", // Light Gray
  ];

  const totalRevenue = charts.topCoursesByRevenue.reduce((acc, curr) => acc + curr.revenue, 0);

  const revenueChartData = {
    labels: charts.topCoursesByRevenue.map((c) => c.courseName),
    datasets: [
      {
        data: charts.topCoursesByRevenue.map((c) => c.revenue),
        backgroundColor: revenueColors,
        borderWidth: 0, // No borders matches the clean modern look better
        hoverOffset: 4,
      },
    ],
  };

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
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            return `$${value.toLocaleString()}`;
          }
        }
      }
    },
    cutout: '75%', // Thinner ring
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
      {/* Gráfico 1: Top Estudiantes (Custom Implementation) */}
      <div className="lg:col-span-5 bg-white px-5 pt-8 pb-10 rounded-[2rem] border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <h3 className="text-lg font-black text-cem-neutral-gray-900 mb-4">
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

      {/* Gráfico 2: Distribución (Doughnut Chart + Custom Legend) */}
      <div className="lg:col-span-7 bg-white px-5 pt-8 pb-10 rounded-[2rem] border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-black text-cem-neutral-gray-900 mb-4">
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
                        label: function (context: any) {
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
    </div>
  );
}

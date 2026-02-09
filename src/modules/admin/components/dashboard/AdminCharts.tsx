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
  // --- BAR CHART CONFIGURATION ---
  const maxStudents = Math.max(...charts.topCoursesByStudents.map(c => c.studentsCount), 10); // Ensure at least 10 for scale

  const studentsChartData = {
    labels: charts.topCoursesByStudents.map((c) =>
      c.courseName.length > 25 ? c.courseName.substring(0, 25) + "..." : c.courseName
    ),
    datasets: [
      {
        label: "Estudiantes",
        data: charts.topCoursesByStudents.map((c) => c.studentsCount),
        backgroundColor: "#00849c", // Teal principal
        barThickness: 12, // Thin bars
        borderRadius: 20, // Fully rounded
      },
      // Optional: If we wanted a background track, we could add a second stacked dataset here,
      // but standard Chart.js stacking sums values. For simplicity and cleanliness, we'll use a clean grid.
    ],
  };

  const studentsChartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "#f1f5f9",
          borderDash: [5, 5],
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 10 }
        },
        border: { display: false },
      },
      y: {
        grid: { display: false }, // No horizontal grid lines
        border: { display: false }, // No axis line
        ticks: {
          color: "#475569", // Slate 600
          font: { weight: 'bold' as const, size: 11 },
          mirror: false, // Keep labels outside
        }
      },
    },
    layout: {
      padding: { right: 20 }
    }
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Gráfico 1: Top Estudiantes (Bar Chart) */}
      <div className="bg-white p-8 rounded-[2rem] border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-black text-cem-neutral-gray-900 mb-6 flex items-center gap-2">
          Cursos más Populares
        </h3>
        <div className="h-[300px]">
          {charts.topCoursesByStudents.length > 0 ? (
            <Bar data={studentsChartData} options={studentsChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-cem-neutral-gray-400 font-medium">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico 2: Mayores Ingresos (Doughnut Chart + Custom Legend) */}
      <div className="bg-white p-8 rounded-[2rem] border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-black text-cem-neutral-gray-900 mb-6">
          Mayores Ingresos
        </h3>

        {charts.topCoursesByRevenue.length > 0 ? (
          <div className="flex flex-col md:flex-row items-center gap-8 h-[300px]">
            {/* Chart Container */}
            <div className="relative w-full md:w-1/2 h-[220px] md:h-full flex items-center justify-center">
              <Doughnut data={revenueChartData} options={revenueChartOptions} />
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-[#006d82]">{charts.topCoursesByRevenue.length}</span>
                <span className="text-xs font-bold text-cem-neutral-gray-400 uppercase tracking-widest">Cursos</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="w-full md:w-1/2 space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {charts.topCoursesByRevenue.map((course, idx) => {
                const percentage = totalRevenue > 0 ? Math.round((course.revenue / totalRevenue) * 100) : 0;
                const color = revenueColors[idx % revenueColors.length];

                return (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className="px-2 py-1 rounded-md text-[10px] font-bold text-white min-w-[3rem] text-center"
                        style={{ backgroundColor: color }}
                      >
                        {percentage}%
                      </span>
                      <span className="text-xs font-medium text-cem-neutral-gray-600 truncate group-hover:text-cem-primary transition-colors" title={course.courseName}>
                        {course.courseName}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-cem-neutral-gray-400 ml-2">
                      ${course.revenue.toLocaleString()}
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

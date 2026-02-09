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
  // Configuración para el gráfico de barras (Estudiantes)
  const studentsChartData = {
    labels: charts.topCoursesByStudents.map((c) =>
      c.courseName.length > 20 ? c.courseName.substring(0, 20) + "..." : c.courseName
    ),
    datasets: [
      {
        label: "Estudiantes Inscritos",
        data: charts.topCoursesByStudents.map((c) => c.studentsCount),
        backgroundColor: "rgba(2, 129, 158, 0.7)", // cem-primary with opacity
        borderColor: "rgba(2, 129, 158, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const studentsChartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#4b5563", // cem-neutral-gray-600
          font: { weight: 'bold' as any }
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      }
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" }, // cem-neutral-gray-500
        grid: { color: "#f3f4f6" }, // cem-neutral-gray-100
      },
      y: {
        ticks: {
          color: "#111827", // cem-neutral-gray-900
          font: { weight: '600' as any }
        },
        grid: { display: false },
      },
    },
  };

  // Configuración para el gráfico de Donut (Ingresos)
  const revenueChartData = {
    labels: charts.topCoursesByRevenue.map((c) =>
      c.courseName.length > 20 ? c.courseName.substring(0, 20) + "..." : c.courseName
    ),
    datasets: [
      {
        label: "Ingresos Generados",
        data: charts.topCoursesByRevenue.map((c) => c.revenue),
        backgroundColor: [
          "#02819E", // cem-primary
          "#ffd60a", // yellow
          "#0d9488", // primary-dark
          "#3b82f6", // blue-500
          "#8b5cf6", // purple-500
        ],
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 15,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#4b5563",
          padding: 20,
          font: { weight: '600' as any }
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
      }
    },
    cutout: '65%',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Gráfico 1: Top Estudiantes */}
      <div className="bg-white p-8 rounded-3xl border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xl font-extrabold text-cem-neutral-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-cem-primary rounded-full"></span>
          Cursos Más Populares
        </h3>
        <div className="h-[350px]">
          {charts.topCoursesByStudents.length > 0 ? (
            <Bar data={studentsChartData} options={studentsChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-cem-neutral-gray-400 font-medium">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico 2: Top Ingresos */}
      <div className="bg-white p-8 rounded-3xl border border-cem-neutral-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xl font-extrabold text-cem-neutral-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
          Mayores Ingresos
        </h3>
        <div className="h-[350px]">
          {charts.topCoursesByRevenue.length > 0 ? (
            <Doughnut data={revenueChartData} options={revenueChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-cem-neutral-gray-400 font-medium">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

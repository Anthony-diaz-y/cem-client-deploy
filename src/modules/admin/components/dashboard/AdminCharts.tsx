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
        backgroundColor: "rgba(255, 214, 10, 0.6)", // yellow-50
        borderColor: "rgba(255, 214, 10, 1)",
        borderWidth: 1,
      },
    ],
  };

  const studentsChartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#999DAA" }, // richblack-300
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#838894" }, // richblack-400
        grid: { color: "#2C333F" }, // richblack-700
      },
      y: {
        ticks: { color: "#838894" },
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
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { color: "#999DAA" },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico 1: Top Estudiantes */}
      <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700">
        <h3 className="text-xl font-bold text-richblack-5 mb-4">
          Cursos Más Populares
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          {charts.topCoursesByStudents.length > 0 ? (
            <Bar data={studentsChartData} options={studentsChartOptions} />
          ) : (
            <p className="text-richblack-400">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Gráfico 2: Top Ingresos */}
      <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700">
        <h3 className="text-xl font-bold text-richblack-5 mb-4">
          Mayores Ingresos
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          {charts.topCoursesByRevenue.length > 0 ? (
            <Doughnut data={revenueChartData} options={revenueChartOptions} />
          ) : (
            <p className="text-richblack-400">No hay datos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}

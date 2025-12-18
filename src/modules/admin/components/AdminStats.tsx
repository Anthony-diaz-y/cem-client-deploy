"use client";

import React from "react";
import { AdminDashboardStats } from "@shared/services/adminAPI";

interface AdminStatsProps {
  stats: AdminDashboardStats | null;
  loading?: boolean;
}

export default function AdminStats({ stats, loading }: AdminStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 animate-pulse"
          >
            <div className="h-4 bg-richblack-700 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-richblack-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 text-center">
        <p className="text-richblack-400">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Instructores Totales",
      value: stats.totalInstructors,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Aprobados",
      value: stats.approvedInstructors,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Pendientes",
      value: stats.pendingInstructors,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      title: "Estudiantes",
      value: stats.totalStudents,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-richblack-800 rounded-xl p-6 border ${stat.borderColor} ${stat.bgColor} transition-all hover:scale-105`}
        >
          <p className="text-sm font-medium text-richblack-400 mb-2">{stat.title}</p>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}


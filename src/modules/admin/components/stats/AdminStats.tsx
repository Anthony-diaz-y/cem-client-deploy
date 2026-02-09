"use client";

import React from "react";
import Link from "next/link";
import { AdminDashboardCounts } from "@shared/services/admin/types";
import CountUp from "@shared/components/ui/CountUp";

interface AdminStatsProps {
  stats: AdminDashboardCounts | null;
  loading?: boolean;
}

/**
 * Componente que muestra las estadísticas principales del dashboard de administración
 * Incluye contadores de instructores, estudiantes y mensajes no leídos
 */
export default function AdminStats({ stats, loading }: AdminStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-cem-neutral-gray-100 animate-pulse shadow-sm"
          >
            <div className="h-4 bg-cem-neutral-gray-100 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-cem-neutral-gray-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-cem-neutral-gray-200 text-center shadow-sm">
        <p className="text-cem-neutral-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Instructores Totales",
      value: stats.totalInstructors,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Aprobados",
      value: stats.approvedInstructors,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      title: "Pendientes",
      value: stats.pendingInstructors,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50/50",
      borderColor: "border-yellow-200/50",
    },
    {
      title: "Estudiantes",
      value: stats.totalStudents,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      title: "Mensajes No Leídos",
      value: stats.unreadMessages || 0,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-100",
      link: "/dashboard/admin/contact-messages",
      highlight: (stats.unreadMessages || 0) > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {statCards.map((stat, index) => {
        // Filter to show only Docentes (Instructores), Aprobados, Estudiantes
        if (!["Instructores Totales", "Aprobados", "Estudiantes"].includes(stat.title)) return null;

        // Rename titles to match design
        const titleMap: Record<string, string> = {
          "Instructores Totales": "Docentes",
          "Aprobados": "Aprobados",
          "Estudiantes": "Estudiantes"
        };

        // Update styling to match Image 2 (Light blue backgrounds)
        // Actually, Image 2 has customized backgrounds:
        // Docentes: Light Blue bg, Blue text
        // Aprobados: Light Blue bg, Blue/Teal text
        // Estudiantes: Light Cyan/Blue bg, Blue text

        // Let's stick to a clean white card for now as seen in Image 2 (it looks like white cards on light gray bg, or light blue cards)
        // Image 2 cards look like light blue/cyan backgrounds with dark numbers.
        // Let's use specific colors.

        const newTitle = titleMap[stat.title];

        return (
          <div
            key={index}
            className={`rounded-[2rem] p-6 border transition-all hover:shadow-md hover:-translate-y-1 shadow-sm flex flex-col justify-between h-full bg-white border-cem-neutral-gray-100/50`}
          >
            <div>
              <p className="text-sm font-medium text-cem-neutral-gray-600 mb-2">{newTitle}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-4xl font-extrabold text-[#00849c]`}>
                  {/* Using a specific teal/blue color from the image style approximately */}
                  <CountUp end={stat.value} duration={2} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


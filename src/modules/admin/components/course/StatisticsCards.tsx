"use client";

import React from "react";
import { CourseDetailsStatistics } from "@shared/services/adminAPI";
import {
  FiUsers,
  FiBook,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";

interface StatisticsCardsProps {
  statistics: CourseDetailsStatistics;
}

export default function StatisticsCards({
  statistics,
}: StatisticsCardsProps) {
  const cards = [
    {
      title: "Estudiantes Inscritos",
      value: statistics.totalStudentsEnrolled,
      icon: FiUsers,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Progreso Promedio",
      value: `${statistics.averageProgressPercentage.toFixed(1)}%`,
      icon: FiTrendingUp,
      color: "green",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Completados",
      value: statistics.studentsCompleted,
      icon: FiCheckCircle,
      color: "green",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "En Progreso",
      value: statistics.studentsInProgress,
      icon: FiClock,
      color: "yellow",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "No Iniciados",
      value: statistics.studentsNotStarted,
      icon: FiUsers,
      color: "gray",
      bgColor: "bg-cem-neutral-gray-50",
      iconColor: "text-cem-neutral-gray-500",
    },
    {
      title: "Calificación Promedio",
      value: statistics.averageRating.toFixed(1),
      icon: FiStar,
      color: "yellow",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Total Discusiones",
      value: statistics.totalDiscussions,
      icon: FiMessageSquare,
      color: "purple",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Lecciones",
      value: statistics.totalSubSections,
      icon: FiBook,
      color: "indigo",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-cem-neutral-gray-100 p-6 hover:border-cem-primary/30 transition-all duration-200 shadow-sm h-[181px] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`text-2xl ${card.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1E293B] mb-1">
                {card.value}
              </p>
              <p className="text-[14px] font-medium text-cem-neutral-gray-500">{card.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


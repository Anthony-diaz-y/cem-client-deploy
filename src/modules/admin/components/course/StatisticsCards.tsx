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
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Progreso Promedio",
      value: `${statistics.averageProgressPercentage.toFixed(1)}%`,
      icon: FiTrendingUp,
      color: "green",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      title: "Completados",
      value: statistics.studentsCompleted,
      icon: FiCheckCircle,
      color: "green",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      title: "En Progreso",
      value: statistics.studentsInProgress,
      icon: FiClock,
      color: "yellow",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      title: "No Iniciados",
      value: statistics.studentsNotStarted,
      icon: FiUsers,
      color: "gray",
      bgColor: "bg-gray-500/10",
      iconColor: "text-gray-400",
    },
    {
      title: "Calificación Promedio",
      value: statistics.averageRating.toFixed(1),
      icon: FiStar,
      color: "yellow",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      subtitle: `(${statistics.totalReviews} reseñas)`,
    },
    {
      title: "Total Discusiones",
      value: statistics.totalDiscussions,
      icon: FiMessageSquare,
      color: "purple",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      subtitle: `(${statistics.totalDiscussionReplies} respuestas)`,
    },
    {
      title: "Lecciones",
      value: statistics.totalSubSections,
      icon: FiBook,
      color: "indigo",
      bgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      subtitle: `(${statistics.totalSections} secciones)`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-richblack-800 rounded-xl border border-richblack-700 p-6 hover:border-richblack-600 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`text-2xl ${card.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-richblack-5 mb-1">
                {card.value}
              </p>
              <p className="text-sm text-richblack-400">{card.title}</p>
              {card.subtitle && (
                <p className="text-xs text-richblack-500 mt-1">
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


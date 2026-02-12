"use client";

import React from "react";
import { AdminStatsProps } from "./interfaces/AdminStats.interface";
import { AdminStatsSkeleton } from "./components/AdminStatsSkeleton";
import { StatCard } from "./components/StatCard";

export default function AdminStats({ stats, loading }: AdminStatsProps) {
    if (loading) {
        return <AdminStatsSkeleton />;
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
            title: "Docentes",
            value: stats.totalInstructors,
        },
        {
            title: "Aprobados",
            value: stats.approvedInstructors,
        },
        {
            title: "Estudiantes",
            value: stats.totalStudents,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full h-full">
            {statCards.map((stat, index) => (
                <StatCard key={index} title={stat.title} value={stat.value} />
            ))}
        </div>
    );
}

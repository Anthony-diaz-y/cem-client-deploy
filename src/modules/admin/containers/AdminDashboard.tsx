"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@shared/store/hooks";
import {
  getAdminDashboard,
  getPendingInstructors,
  Instructor,
} from "@shared/services/adminAPI";
import AdminStats from "../components/stats/AdminStats";
import PendingInstructorsTable from "../components/instructor/PendingInstructorsTable";
import AdminCharts from "../components/dashboard/AdminCharts";
import RevenueCard from "../components/dashboard/RevenueCard";

export default function AdminDashboard() {
  const { token } = useAppSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [pendingInstructors, setPendingInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, filter]);

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [dashData, pendingData] = await Promise.all([
        getAdminDashboard(token, filter),
        getPendingInstructors(token),
      ]);

      setDashboardData(dashData);
      setPendingInstructors(pendingData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { id: "today", name: "Hoy" },
    { id: "week", name: "Esta Semana" },
    { id: "month", name: "Este Mes" },
    { id: "year", name: "Este Año" },
    { id: "all", name: "Todo" },
  ];

  return (
    <div className="bg-cem-background text-cem-neutral-gray-900">
      {/* Header & Filter Section Combined */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-black text-cem-neutral-gray-900 mb-2 tracking-tight">
            Dashboard de Administración
          </h1>
          <p className="text-cem-neutral-gray-600 font-medium">
            Vista general de estadísticas y métricas de rendimiento.
          </p>
        </div>

        <div className="bg-white p-1.5 rounded-xl border border-cem-neutral-gray-100 flex shadow-sm">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === option.id
                ? "bg-cem-primary/10 text-cem-primary shadow-sm"
                : "text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600 hover:bg-cem-neutral-gray-50"
                }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sección Combinada: Ingresos y Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Columna Izquierda: Ingresos */}
        <div className="lg:col-span-2 h-full">
          <RevenueCard
            revenue={dashboardData?.revenue || { total: 0, period: filter }}
            loading={loading}
          />
        </div>

        {/* Columna Derecha: Tarjetas de Resumen (Counts) */}
        <div className="lg:col-span-3 h-full">
          <AdminStats stats={dashboardData?.counts || null} loading={loading} />
        </div>
      </div>

      {/* Sección 3: Gráficos */}
      {dashboardData?.charts && !loading && (
        <AdminCharts charts={dashboardData.charts} />
      )}

      <div className="mt-8 border-t border-cem-neutral-gray-200 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-cem-neutral-gray-900">
              Solicitudes Pendientes
            </h2>
            <p className="text-sm text-cem-neutral-gray-600 mt-1">
              Instructores esperando aprobación.
            </p>
          </div>
          {pendingInstructors.length > 0 && (
            <Link
              href="/dashboard/admin/instructors"
              className="px-4 py-2 bg-cem-primary text-cem-neutral-white rounded-lg font-medium hover:bg-cem-primary-dark transition-colors text-sm inline-block"
            >
              Ver Todos los Instructores →
            </Link>
          )}
        </div>
        <PendingInstructorsTable
          instructors={pendingInstructors}
          token={token || ""}
          onUpdate={fetchData}
        />
      </div>
    </div>
  );
}


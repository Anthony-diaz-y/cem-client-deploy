"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@shared/store/hooks";
import {
  getAdminDashboard,
  getPendingInstructors,
  Instructor,
  getAdminDashboard as getDashboardData
} from "@shared/services/adminAPI";
import AdminStats from "../components/stats/AdminStats";
import PendingInstructorsTable from "../components/instructor/PendingInstructorsTable";
import AdminCharts from "../components/dashboard/AdminCharts";
import RevenueCard from "../components/dashboard/RevenueCard";
import CustomDropdown from "../components/dropdown/CustomDropdown";

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
    <div className="text-richblack-5">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-richblack-5 mb-2">
          Dashboard de Administración
        </h1>
        <p className="text-richblack-400">
          Vista general de estadísticas y métricas de rendimiento.
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-8 flex justify-end">
        <div className="bg-richblack-800 p-1 rounded-lg border border-richblack-700 flex">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === option.id
                ? "bg-yellow-50 text-richblack-900 shadow-sm"
                : "text-richblack-200 hover:text-richblack-5 hover:bg-richblack-700"
                }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sección 1: Tarjetas de Resumen (Counts) */}
      <AdminStats stats={dashboardData?.counts || null} loading={loading} />

      {/* Sección 2: Ingresos */}
      <RevenueCard
        revenue={dashboardData?.revenue || { total: 0, period: filter }}
        loading={loading}
      />

      {/* Sección 3: Gráficos */}
      {dashboardData?.charts && !loading && (
        <AdminCharts charts={dashboardData.charts} />
      )}

      <div className="mt-8 border-t border-richblack-700 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-richblack-5">
              Solicitudes Pendientes
            </h2>
            <p className="text-sm text-richblack-400 mt-1">
              Instructores esperando aprobación.
            </p>
          </div>
          {pendingInstructors.length > 0 && (
            <Link
              href="/dashboard/admin/instructors"
              className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors text-sm inline-block"
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


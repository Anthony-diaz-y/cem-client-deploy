"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@shared/store/hooks";
import {
  getAdminDashboard,
  getPendingInstructors,
  Instructor,
} from "@shared/services/adminAPI";
import AdminStats from "../components/stats/AdminStats";
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
    <div className="bg-cem-background xl:pr-20 text-cem-neutral-gray-900 mt-3">
      {/* Header & Filter Section Combined */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-3 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-semibold text-cem-neutral-gray-900 mb-2 tracking-tight">
            Dashboard de Administración
          </h1>
          <p className="text-cem-neutral-gray-600 font-medium">
            Vista general de estadísticas y métricas de rendimiento.
          </p>
        </div>
      </div>
      <div className="  justify-end rounded-xl flex mb-5">
        <div className="border border-cem-neutral  bg-cem-neutral-gray-800/5 rounded-md gray-100 p-1">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-lg text-xs  tracking-widest transition-all ${filter === option.id
                ? "bg-white text-cem-primary font-semibold shadow-sm"
                : " hover:text-cem-neutral-gray-600 hover:bg-cem-neutral-gray-50"
                }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sección Combinada: Ingresos y Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8 items-stretch">
        {/* Columna Izquierda: Ingresos */}
        <div className="lg:col-span-5 flex">
          <RevenueCard
            revenue={dashboardData?.revenue || { total: 0, period: filter }}
            loading={loading}
          />
        </div>

        {/* Columna Derecha: Tarjetas de Resumen (Counts) */}
        <div className="lg:col-span-7 flex">
          <AdminStats stats={dashboardData?.counts || null} loading={loading} />
        </div>
      </div>

      {/* Sección 3: Gráficos */}
      {dashboardData?.charts && !loading && (
        <AdminCharts charts={dashboardData.charts} />
      )}
    </div>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@shared/store/hooks";
import { getAdminDashboard, getPendingInstructors, Instructor } from "@shared/services/adminAPI";
import AdminStats from "../components/stats/AdminStats";
import PendingInstructorsTable from "../components/instructor/PendingInstructorsTable";

export default function AdminDashboard() {
  const { token } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [pendingInstructors, setPendingInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [dashboardData, pendingData] = await Promise.all([
        getAdminDashboard(token),
        getPendingInstructors(token),
      ]);

      setStats(dashboardData);
      setPendingInstructors(pendingData);
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-richblack-5">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5 mb-2">
            Dashboard de Administración
          </h1>
          <p className="text-richblack-400">
            Vista general de estadísticas y acciones rápidas de la plataforma
          </p>
        </div>
      </div>

      <AdminStats stats={stats} loading={loading} />

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-richblack-5">
              Solicitudes Pendientes
            </h2>
            <p className="text-sm text-richblack-400 mt-1">
              Revisa y aprueba las solicitudes de nuevos instructores. Para gestión completa con filtros, búsqueda y edición, ve a la sección "Instructores".
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


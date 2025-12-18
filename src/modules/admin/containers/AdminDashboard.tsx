"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@shared/store/hooks";
import { getAdminDashboard, getPendingInstructors, Instructor } from "@shared/services/adminAPI";
import AdminStats from "../components/AdminStats";
import PendingInstructorsTable from "../components/PendingInstructorsTable";

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
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-richblack-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5 mb-2">
          Dashboard de Administrador
        </h1>
        <p className="text-richblack-400">
          Gestiona instructores y visualiza estadísticas de la plataforma
        </p>
      </div>

      <AdminStats stats={stats} loading={loading} />

      <div className="mt-8">
        <PendingInstructorsTable
          instructors={pendingInstructors}
          token={token || ""}
          onUpdate={fetchData}
        />
      </div>
    </div>
  );
}


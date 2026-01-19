"use client";

import React from "react";
import { AdminDashboardRevenue } from "@shared/services/admin/types";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import CountUp from "@shared/components/CountUp";

interface RevenueCardProps {
  revenue: AdminDashboardRevenue;
  loading?: boolean;
}

export default function RevenueCard({ revenue, loading }: RevenueCardProps) {
  if (loading) {
    return (
      <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 animate-pulse mb-8">
        <div className="h-6 bg-richblack-700 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-richblack-700 rounded w-1/3"></div>
      </div>
    );
  }

  // Mapear el periodo a texto legible
  const periodMap: Record<string, string> = {
    today: "hoy",
    week: "esta semana",
    month: "este mes",
    year: "este año",
    all: "total histórico",
  };

  const periodText = periodMap[revenue.period] || revenue.period;

  return (
    <div className="bg-gradient-to-r from-richblack-800 to-richblack-900 rounded-xl p-6 border border-richblack-700 mb-8 relative overflow-hidden group hover:border-yellow-200 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <HiOutlineCurrencyDollar className="text-9xl text-yellow-50" />
      </div>

      <div className="relative z-10">
        <h2 className="text-richblack-300 font-medium text-lg mb-1">
          Ingresos Totales ({periodText})
        </h2>
        <p className="text-4xl font-bold text-yellow-50">
          <CountUp
            end={revenue.total}
            decimals={2}
            prefix="$ "
            duration={2.5}
          />
        </p>
        <p className="text-sm text-richblack-400 mt-2">
          Generado por ventas de cursos durante {periodText}.
        </p>
      </div>
    </div>
  );
}

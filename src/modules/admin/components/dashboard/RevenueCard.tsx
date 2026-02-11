"use client";

import React from "react";
import { AdminDashboardRevenue } from "@shared/services/admin/types";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import CountUp from "@shared/components/ui/CountUp";

interface RevenueCardProps {
  revenue: AdminDashboardRevenue;
  loading?: boolean;
}

export default function RevenueCard({ revenue, loading }: RevenueCardProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-cem-primary to-[#036d85] rounded-xl px-8 py-4 animate-pulse shadow-sm h-full w-full flex flex-col justify-between relative overflow-hidden min-h-[110px]">
        {/* Placeholder para el icono de moneda */}
        <div className="absolute top-0 right-5 mt-1.5 opacity-20">
          <div className="w-20 h-20 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-white/40 rounded w-2/3"></div>
          </div>
          <div className="h-3 bg-white/20 rounded w-3/4 mt-4"></div>
        </div>
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
    <div className="bg-gradient-to-br w-full from-cem-primary to-[#036d85]  rounded-xl px-8 py-4 relative overflow-hidden group shadow-lg shadow-cem-primary/10 transition-all hover:shadow-xl hover:shadow-cem-primary/20 h-full flex flex-col justify-between">
      {/* Decorative background circle */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

      <div className="absolute top-0 lg:top-5 xl:top-0 right-1 sm:right-3 lg:right-2 xl:right-5 mt-1.5 group-hover:opacity-30 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
        <HiOutlineCurrencyDollar className="text-[70px] sm:text-[80px] lg:text-[60px] xl:text-[90px] text-white" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <h2 className="text-white/80 font-semibold text-base mb-0.5 flex items-center gap-2">
            Ingresos Totales ({periodText})
          </h2>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-semibold text-white tracking-tight">
              <CountUp
                end={revenue.total}
                decimals={2}
                prefix="$ "
                duration={2.5}
              />
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-white/70 font-medium italic">
            {'"Impulsando la Transformación Educativa"'}
          </p>

        </div>
      </div>
    </div>
  );
}

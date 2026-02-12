import React from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import CountUp from "@shared/components/ui/CountUp";
import { AdminDashboardRevenue } from "@shared/services/admin/types";

interface RevenueCardContentProps {
    revenue: AdminDashboardRevenue;
    periodText: string;
}

export const RevenueCardContent: React.FC<RevenueCardContentProps> = ({ revenue, periodText }) => {
    return (
        <div className="bg-gradient-to-br w-full from-cem-primary to-[#036d85]  rounded-2xl px-8 py-4 relative overflow-hidden group shadow-lg shadow-cem-primary/10 transition-all hover:shadow-xl hover:shadow-cem-primary/20 h-full flex flex-col justify-between">
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
};

import { useMemo } from "react";
import { AdminDashboardRevenue } from "@shared/services/admin/types";

export const useRevenueCard = (revenue: AdminDashboardRevenue) => {
    const periodText = useMemo(() => {
        const periodMap: Record<string, string> = {
            today: "hoy",
            week: "esta semana",
            month: "este mes",
            year: "este año",
            all: "total histórico",
        };
        return periodMap[revenue.period] || revenue.period;
    }, [revenue.period]);

    return { periodText };
};

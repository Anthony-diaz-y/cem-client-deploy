import { AdminDashboardCounts } from "@shared/services/admin/types";

export interface AdminStatsProps {
    stats: AdminDashboardCounts | null;
    loading?: boolean;
}

export interface StatCardProps {
    title: string;
    value: number;
    highlight?: boolean;
}

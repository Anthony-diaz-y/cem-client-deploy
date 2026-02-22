export interface AdminDashboardCounts {
  totalInstructors: number;
  approvedInstructors: number;
  pendingInstructors: number;
  totalStudents: number;
  unreadMessages: number;
}

export interface AdminDashboardRevenue {
  total: number;
  period: string;
}

export interface AdminDashboardCharts {
  topCoursesByStudents: Array<{
    id: string;
    courseName: string;
    thumbnail: string;
    studentsCount: number;
  }>;
  topCoursesByRevenue: Array<{
    id: string;
    courseName: string;
    thumbnail: string;
    revenue: number;
  }>;
}

export interface AdminDashboardData {
  counts: AdminDashboardCounts;
  revenue: AdminDashboardRevenue;
  charts: AdminDashboardCharts;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
  message: string;
}

export type AdminDashboardStats = AdminDashboardCounts;

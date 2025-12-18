"use client";

import { useState } from "react";
import AdminDashboard from "@modules/admin/containers/AdminDashboard";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

export default function AdminDashboardPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted || user?.accountType !== ACCOUNT_TYPE.ADMIN) {
    return null;
  }

  return <AdminDashboard />;
}


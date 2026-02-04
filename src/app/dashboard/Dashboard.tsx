"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@shared/store/hooks";
import Sidebar from "@modules/dashboard/components/Sidebar";
import { Loading } from "@shared/components";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading: authLoading } = useAppSelector((state) => state.auth);
  const { loading: profileLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const isLoading = profileLoading || authLoading;

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-richblack-900">
        {isLoading ? (
          <div className="mt-10">
            <Loading />
          </div>
        ) : (
          <div className="mx-auto w-11/12 max-w-[1000px] py-10">{children}</div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useAppSelector } from "@shared/store/hooks";
import Sidebar from "@modules/dashboard/components/Sidebar";
import Loading from "@shared/components/Loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading: authLoading } = useAppSelector((state) => state.auth);
  const { loading: profileLoading } = useAppSelector((state) => state.profile);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  if (profileLoading || authLoading) {
    return (
      <div className="mt-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
      <Sidebar />

      <div className="h-[calc(100vh-3.5rem)] overflow-auto w-full">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10 ">{children}</div>
      </div>
    </div>
  );
}

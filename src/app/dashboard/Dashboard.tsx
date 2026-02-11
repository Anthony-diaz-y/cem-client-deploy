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
  const [mounted, setMounted] = useState(false);
  const isLoading = profileLoading || authLoading;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Prevent hydration mismatch by not rendering dynamic content on server
  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen bg-cem-background pt-14">
      {/* Sidebar - Contenedor con sticky para que se mantenga fijo mientras el body scrollea */}
      <aside className="hidden sm:block sticky top-14 self-start">
        <Sidebar />
      </aside>

      {/* Main Content - Fluye naturalmente, permitiendo llegar al footer global */}
      <main className="flex-1 w-full min-h-full flex flex-col">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10 flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loading />
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}

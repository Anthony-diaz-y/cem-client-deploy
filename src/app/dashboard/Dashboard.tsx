"use client";

import React, { useEffect, useState } from "react";
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
  
  // Evitar errores de hidratación: inicializar mounted como false en ambos servidor y cliente
  // Esto asegura que el render inicial sea idéntico en ambos
  const [mounted, setMounted] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      setMounted(true);
    }
  }, []);

  // Actualizar showLoading solo después del mount para evitar diferencias de hidratación
  useEffect(() => {
    if (mounted) {
      setShowLoading(profileLoading || authLoading);
    }
  }, [mounted, profileLoading, authLoading]);

  // Renderizar siempre la misma estructura inicial para evitar errores de hidratación
  // En el servidor y en el primer render del cliente, siempre mostrar contenido (no loading)
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] overflow-auto w-full">
        {showLoading ? (
          <div className="mt-10">
            <Loading />
          </div>
        ) : (
          <div className="mx-auto w-11/12 max-w-[1000px] py-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

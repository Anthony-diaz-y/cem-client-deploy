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
  
  // Inicializar mounted como false para que el render inicial sea idéntico en servidor y cliente
  const [mounted, setMounted] = useState(false);

  // Scroll to the top y marcar como montado solo en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      setMounted(true);
    }
  }, []);

  // Renderizar siempre la misma estructura inicial para evitar errores de hidratación
  // En el servidor y en el primer render del cliente, siempre mostrar contenido
  // El loading solo se muestra después de que el componente esté montado
  const isLoading = mounted && (profileLoading || authLoading);

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden">
        {isLoading ? (
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

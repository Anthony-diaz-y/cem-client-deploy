"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@shared/store/Provider";
import { checkAndInitializeDemo } from "@shared/data/demoHelper";

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🎭 Initialize demo mode if enabled
  useEffect(() => {
    checkAndInitializeDemo();
  }, []);

  return (
    <StoreProvider>
      <Toaster />
      {children}
    </StoreProvider>
  );
}

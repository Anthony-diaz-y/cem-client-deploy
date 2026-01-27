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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />
      {children}
    </StoreProvider>
  );
}

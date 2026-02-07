"use client";

import { useEffect } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
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
      <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "USD", intent: "capture" }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
          containerStyle={{
            top: 80,
            right: 20,
          }}
        />
        {children}
      </PayPalScriptProvider>
    </StoreProvider>
  );
}

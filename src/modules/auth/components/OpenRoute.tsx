"use client";

// This will prevent authenticated users from accessing this route
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

import { RootState } from "@shared/store/store";
import { OpenRouteProps } from "../types";

function OpenRoute({ children }: OpenRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if user is authenticated
    if (mounted && token !== null) {
      const isAuthPage =
        pathname === "/auth/login" || pathname === "/auth/signup";
      if (isAuthPage) {
        router.push("/dashboard/my-profile");
      }
    }
  }, [token, pathname, router, mounted]);

  // No renderizar nada hasta que el cliente esté montado (evita hydration mismatch)
  if (!mounted) return null;

  // If user is authenticated and on auth page, don't render (will redirect)
  if (
    token !== null &&
    (pathname === "/auth/login" || pathname === "/auth/signup")
  ) {
    return null;
  }

  // Otherwise, render children
  return <>{children}</>;
}

export default OpenRoute;

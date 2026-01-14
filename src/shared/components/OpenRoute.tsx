"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "../store/hooks";
import { ACCOUNT_TYPE } from "../utils/constants";

export default function OpenRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect after component is mounted and if user is authenticated
    if (mounted && token !== null) {
      const isAuthPage =
        pathname === "/auth/login" || pathname === "/auth/signup";
      if (isAuthPage) {
        if (user?.accountType === ACCOUNT_TYPE.ADMIN) {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/my-profile");
        }
      }
    }
  }, [mounted, token, pathname, router, user]);

  // If component is not mounted yet, render nothing to avoid flash
  if (!mounted) {
    return null;
  }

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

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "../../store/hooks";
import { ACCOUNT_TYPE } from "../../utils/constants";

const OpenRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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

  if (!mounted) {
    return null;
  }

  if (
    token !== null &&
    (pathname === "/auth/login" || pathname === "/auth/signup")
  ) {
    return null;
  }

  return <>{children}</>;
};

export default OpenRoute;


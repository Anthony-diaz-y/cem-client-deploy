"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../store/hooks";
import { MOCK_MODE } from "../../services/apiConnector";
import { Loading } from "@shared/components";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (MOCK_MODE) {
      return;
    }

    if (token === null) {
      router.push("/");
    }
  }, [token, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-cem-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (MOCK_MODE) {
    return <>{children}</>;
  }

  if (token !== null) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full bg-cem-background flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default ProtectedRoute;


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../store/hooks";
import { MOCK_MODE } from "../../services/apiConnector";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (MOCK_MODE) {
      return;
    }

    if (token === null) {
      router.push("/");
    }
  }, [token, router]);

  if (MOCK_MODE) {
    return <>{children}</>;
  }

  if (token !== null) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;


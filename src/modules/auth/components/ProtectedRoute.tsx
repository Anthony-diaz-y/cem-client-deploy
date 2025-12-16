"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { MOCK_MODE } from "@shared/services/apiConnector";
import { RootState } from "@shared/store/store";
import { ProtectedRouteProps } from "../types";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // user not logged in
    if (!MOCK_MODE && token === null) {
      router.push("/");
    }
  }, [token, router]);

  // 🎭 DEMO MODE: Allow access without authentication when in mock mode
  if (MOCK_MODE) {
    return children;
  }

  // user logged in
  if (token !== null) {
    return children;
  }

  return null;
};

export default ProtectedRoute;

"use client";

import AllScheduledClassesContainer from "@modules/admin/containers/AllScheduledClassesContainer";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { useState } from "react";

export default function AllScheduledClassesPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) {
    return null;
  }

  if (user?.accountType !== ACCOUNT_TYPE.ADMIN) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <p className="text-richblack-5 text-3xl">Acceso Denegado</p>
      </div>
    );
  }

  return <AllScheduledClassesContainer />;
}


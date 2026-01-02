"use client";

import PendingCoursesContainer from "@modules/admin/containers/PendingCoursesContainer";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { useEffect, useState } from "react";

export default function PendingCoursesPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return <PendingCoursesContainer />;
}


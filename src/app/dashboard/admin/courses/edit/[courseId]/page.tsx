"use client";

import { useState } from "react";
import AdminEditCourse from "@modules/admin/containers/AdminEditCourse";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

export default function AdminEditCoursePage() {
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

  return <AdminEditCourse />;
}


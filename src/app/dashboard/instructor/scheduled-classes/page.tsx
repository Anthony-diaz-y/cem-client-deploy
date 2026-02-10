"use client";

import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { useState } from "react";
import InstructorClassesManagementContainer from "@modules/scheduled-classes/containers/InstructorClassesManagementContainer";

export default function InstructorScheduledClassesPage() {
  const { user } = useAppSelector((state) => state.profile);
  
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) {
    return null;
  }

  if (user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <p className="text-cem-neutral-gray-900 text-3xl">Acceso Denegado</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InstructorClassesManagementContainer />
    </div>
  );
}


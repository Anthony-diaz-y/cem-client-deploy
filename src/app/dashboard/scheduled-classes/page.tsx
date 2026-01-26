"use client";

import { useAppSelector } from "@shared/store/hooks";
import ScheduledClassesContainer from "@modules/scheduled-classes/containers/ScheduledClassesContainer";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { useState } from "react";

export default function StudentScheduledClassesPage() {
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) {
    return null;
  }

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
      </div>
    );
  }

  if (user.accountType !== ACCOUNT_TYPE.STUDENT) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <p className="text-richblack-5 text-3xl">Acceso Denegado</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ScheduledClassesContainer 
        token={token} 
        userRole={user.accountType} 
        userId={user._id} 
      />
    </div>
  );
}


"use client";

import AllInstructorsContainer from "@modules/admin/containers/AllInstructorsContainer";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { useEffect, useState } from "react";

export default function AllInstructorsPage() {
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
        <p className="text-cem-neutral-gray-900 text-3xl">Acceso Denegado</p>
      </div>
    );
  }

  return <AllInstructorsContainer />;
}


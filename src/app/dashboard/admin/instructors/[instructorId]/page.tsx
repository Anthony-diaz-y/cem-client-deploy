"use client";

import InstructorDetails from "@modules/admin/components/instructor/InstructorDetails";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InstructorDetailsPage() {
  const { user } = useAppSelector((state) => state.profile);
  const { token } = useAppSelector((state) => state.auth);
  const params = useParams();
  const instructorId = params?.instructorId as string;
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

  if (!token || !instructorId) {
    return (
      <div className="text-center text-cem-neutral-gray-600 py-8">
        <p className="text-lg">Datos no disponibles</p>
      </div>
    );
  }

  return <InstructorDetails instructorId={instructorId} token={token} />;
}


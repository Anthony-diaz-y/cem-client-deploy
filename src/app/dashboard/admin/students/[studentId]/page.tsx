"use client";

import { use } from "react";
import { useAppSelector } from "@shared/store/hooks";
import StudentDetails from "@modules/admin/components/student/StudentDetails";

interface PageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default function StudentDetailsPage({ params }: PageProps) {
  const { studentId } = use(params);
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  return <StudentDetails studentId={studentId} token={token} />;
}

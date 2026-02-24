"use client";

import { use } from "react";
import { useAppSelector } from "@shared/store/hooks";
import EditStudent from "@modules/admin/components/student/EditStudent";

interface PageProps {
    params: Promise<{
        studentId: string;
    }>;
}

export default function EditStudentPage({ params }: PageProps) {
    const { studentId } = use(params);
    const { token } = useAppSelector((state) => state.auth);

    if (!token) {
        return (
            <div className="text-center text-cem-neutral-gray-600 py-8">
                No autorizado. Por favor, inicia sesión.
            </div>
        );
    }

    return <EditStudent studentId={studentId} token={token} />;
}

"use client";

import { useState, useEffect } from "react";
import VideoDetails from "@/modules/view-course/components/VideoDetails";
import { useAppSelector } from "@/shared/store/hooks";
import { ACCOUNT_TYPE } from "@/shared/utils/constants";

export default function VideoDetailsPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-richblack-400">Cargando...</p>
      </div>
    );
  }

  if (user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return null;
  }

  return <VideoDetails />;
}

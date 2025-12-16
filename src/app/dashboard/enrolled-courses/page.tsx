"use client";

import { useState } from "react";
import { EnrolledCourses } from "@modules/dashboard";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

export default function EnrolledCoursesPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted || user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return null;
  }

  return <EnrolledCourses />;
}

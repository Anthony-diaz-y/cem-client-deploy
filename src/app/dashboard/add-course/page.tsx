"use client";

import { useState } from "react";
import AddCourse from "@modules/add-course/containers/AddCourse";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

export default function AddCoursePage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted || user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR) {
    return null;
  }

  return <AddCourse />;
}

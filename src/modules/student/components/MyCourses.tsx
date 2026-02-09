"use client";

import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { fetchInstructorCourses } from "@shared/services/courseDetailsAPI";
import { IconBtn } from "@shared/components";
import CoursesTable, {
  Course,
} from "@modules/instructor/components/CoursesTable";
import { RootState } from "@shared/store/store";
import { STUDENT_TEXTS } from "../constants/student.constants";
import { useScrollToTop } from "@modules/profile/hooks/useScrollToTop";

export default function MyCourses() {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const result = await fetchInstructorCourses(token);
        if (result) {
          setCourses(result as unknown as Course[]);
        }
      } catch (error) {
        console.error(STUDENT_TEXTS.errors.fetchCourses, error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  useScrollToTop();

  return (
    <div>
      <div className="mb-14 flex justify-between">
        <h1 className="text-4xl font-medium text-cem-neutral-gray-900 font-boogaloo text-center lg:text-left">
          {STUDENT_TEXTS.myCourses.title}
        </h1>
        <IconBtn
          text={STUDENT_TEXTS.myCourses.addCourse}
          onclick={() => router.push(STUDENT_TEXTS.myCourses.links.addCourse)}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {/* course Table */}
      {courses && (
        <CoursesTable
          courses={courses}
          setCourses={setCourses}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}

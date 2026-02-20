"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchInstructorCourses } from "../services/InstructorDashboardAPI";
import CoursesTable from "../components/CoursesTable";
import { Course } from "../types";
import { RootState } from "@/shared/store/store";
import { INSTRUCTOR_TEXTS } from "../constants/instructor.constants";

export default function InstructorCourses() {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchCourses = async () => {
      try {
        const result = await fetchInstructorCourses(token);
        if (result) {
          setCourses(result as unknown as Course[]);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [token]);

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-cem-neutral-gray-900">{INSTRUCTOR_TEXTS.courses.title}</h1>
        <button
          onClick={() => {
            router.push(INSTRUCTOR_TEXTS.links.addCourse);
          }}
          className="flex items-center gap-x-1 rounded-md bg-cem-primary px-4 py-2 font-semibold text-cem-neutral-white transition-all duration-200 hover:bg-cem-primary-dark hover:scale-95"
        >
          {INSTRUCTOR_TEXTS.courses.addCourse}
        </button>
      </div>
      <CoursesTable
        courses={courses}
        setCourses={setCourses}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}

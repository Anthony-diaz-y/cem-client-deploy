'use client'

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { fetchInstructorCourses } from "../services/InstructorDashboardAPI"
import CoursesTable from "../components/CoursesTable"
import { Course } from "../types"
import { RootState } from "@/shared/store/store"

export default function InstructorCourses() {
  const { token } = useSelector((state: RootState) => state.auth)
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchCourses()
  }, [token])

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <button
          onClick={() => {
            router.push("/dashboard/add-course")
          }}
          className="flex items-center gap-x-1 rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
        >
          Add Course
        </button>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} loading={loading} setLoading={setLoading} />}
    </div>
  )
}

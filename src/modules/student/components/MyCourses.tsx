'use client'

import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"

import { fetchInstructorCourses } from "../../../shared/services/courseDetailsAPI"
import IconBtn from "../../../shared/components/IconBtn"
import CoursesTable, { Course } from "../../instructor/components/CoursesTable"
import { RootState } from "../../../shared/store/store"



export default function MyCourses() {
  const { token } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return;
    
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const result = await fetchInstructorCourses(token)
        // console.log('Instructors all courses  ', result);
        if (result) {
          setCourses(result)
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false);
      }
    }
    fetchCourses()
  }, [token])


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [])

  return (
    <div>
      <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => router.push("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {/* course Table */}
      {courses && <CoursesTable courses={courses} setCourses={setCourses} loading={loading} setLoading={setLoading} />}
    </div>
  )
}
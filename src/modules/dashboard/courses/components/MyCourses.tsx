'use client'

import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"

import { fetchInstructorCourses } from "../../../../shared/services/courseDetailsAPI"
import IconBtn from "../../../../shared/components/IconBtn"
import CoursesTable from "../../instructor/components/CoursesTable"



export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token)
      // console.log('Instructors all courses  ', result);
      setLoading(false);
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [])


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
'use client'

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "next/navigation"
import { useAppSelector } from "../../../shared/store/hooks"

import { getFullDetailsOfCourse, } from "../../../shared/services/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../course/store/courseSlice"
import RenderSteps from "../../add-course/components/RenderSteps"
import Loading from '../../../shared/components/Loading';
import { AppDispatch } from "../../../shared/store/store"

export default function EditCourse() {
  const { courseId } = useParams();
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAppSelector((state) => state.auth)
  const { course } = useAppSelector((state) => state.course)
  // console.log('before course data = ', course)

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      if (!courseId || !token) return
      
      setLoading(true)
      try {
        const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId
        const result = await getFullDetailsOfCourse(courseIdString, token);
        // console.log('Data from edit course file = ', result)
        if (result?.courseDetails) {
          dispatch(setEditCourse(true))
          dispatch(setCourse(result.courseDetails))
        }
      } catch (error) {
        console.error("Error fetching course details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFullCourseDetails();
  }, [courseId, token, dispatch])

  // Loading
  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex w-full items-start gap-x-6">

      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 text-center sm:text-left">
          Edit Course
        </h1>

        {loading ? <Loading />
          :
          (<div className="flex-1">
            {course ? <RenderSteps />
              :
              (<p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                Course not found
              </p>)
            }
          </div>)}
      </div>

      {/* Course Upload Tips  */}
      {/* <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 ">
        <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <li>Set the Course Price option or make it free.</li>
          <li>Standard size for the course thumbnail is 1024x576.</li>
          <li>Video section controls the course overview video.</li>
          <li>Course Builder is where you create & organize a course.</li>
          <li>Add Topics in the Course Builder section to create lessons,quizzes, and assignments.</li>
          <li>Information from the Additional Data section shows up on thecourse single page.</li>
          <li>Make Announcements to notify any important</li>
          <li>Notes to all enrolled students at once.</li>
        </ul>
      </div> */}

    </div>
  )
}
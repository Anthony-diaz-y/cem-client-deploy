import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { setStep, setEditCourse } from "../../course/store/courseSlice"
import { RootState } from "../../../shared/store/store"
import { Course } from "../../course/types"

/**
 * Custom hook for course builder navigation logic
 * Separates navigation logic from component
 */
export const useCourseBuilderNavigation = () => {
  const dispatch = useDispatch()
  const { course } = useSelector((state: RootState) => state.course)

  const goToNext = () => {
    if (!course) return

    const courseData = course as Course
    if (courseData.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      courseData.courseContent.some(
        (section) => section.subSection.length === 0
      )
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }

    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return { goToNext, goBack }
}


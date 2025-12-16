import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import {
  createSection,
  updateSection,
} from "../../../shared/services/courseDetailsAPI"
import { setCourse } from "../../course/store/courseSlice"
import { RootState } from "../../../shared/store/store"
import { Course } from "../../course/types"
import { CourseBuilderFormData } from "../types"

/**
 * Custom hook for section form logic
 * Separates form handling logic from component
 */
export const useSectionForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseBuilderFormData>()

  const { course } = useSelector((state: RootState) => state.course)
  const { token } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState<string | null>(null)

  const onSubmit = async (data: CourseBuilderFormData) => {
    if (!token) return

    setLoading(true)
    let result

    try {
      if (editSectionName && course) {
        const courseData = course as Course
        result = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: courseData._id,
          },
          token
        )
      } else if (course) {
        const courseData = course as Course
        result = await createSection(
          { sectionName: data.sectionName, courseId: courseData._id },
          token
        )
      }

      if (result) {
        dispatch(setCourse(result))
        setEditSectionName(null)
        setValue("sectionName", "")
      }
    } catch (error) {
      console.error("Error submitting section:", error)
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (
    sectionId: string,
    sectionName: string
  ) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  return {
    register,
    handleSubmit,
    errors,
    loading,
    editSectionName,
    onSubmit,
    cancelEdit,
    handleChangeEditSectionName,
  }
}


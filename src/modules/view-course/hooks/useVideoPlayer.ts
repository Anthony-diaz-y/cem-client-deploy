import { useEffect, useState, useRef } from "react"
import { useRouter, useParams, usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { markLectureAsComplete } from "../../../shared/services/courseDetailsAPI"
import { updateCompletedLectures } from "../store/viewCourseSlice"
import { RootState, AppDispatch } from "../../../shared/store/store"
import { Section, SubSection } from "../types"

/**
 * Custom hook for video player logic
 * Separates video player state and logic from component
 */
export const useVideoPlayer = (courseSectionData: Section[], courseEntireData: { thumbnail: string } | null) => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { courseId, sectionId, subSectionId } = params as {
    courseId: string
    sectionId: string
    subSectionId: string
  }
  const { token } = useSelector((state: RootState) => state.auth)
  const { completedLectures } = useSelector((state: RootState) => state.viewCourse)

  const playerRef = useRef<{ seek: (time: number) => void } | null>(null)
  const [videoData, setVideoData] = useState<SubSection | null>(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        router.push(`/dashboard/enrolled-courses`)
      } else {
        const filteredData = courseSectionData.filter(
          (course: Section) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data: SubSection) => data._id === subSectionId
        )
        if (filteredVideoData && filteredVideoData[0])
          setVideoData(filteredVideoData[0])
        if (courseEntireData) setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [
    courseSectionData,
    courseEntireData,
    pathname,
    courseId,
    sectionId,
    subSectionId,
    router,
  ])

  const handleLectureCompletion = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await markLectureAsComplete(
        { courseId: courseId, subsectionId: subSectionId },
        token
      )
      if (res) {
        dispatch(updateCompletedLectures(subSectionId))
      }
    } catch (error) {
      console.error("Error marking lecture as complete:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRewatch = () => {
    if (playerRef?.current) {
      playerRef.current.seek(0)
      setVideoEnded(false)
    }
  }

  return {
    playerRef,
    videoData,
    previewSource,
    videoEnded,
    loading,
    setVideoEnded,
    handleLectureCompletion,
    handleRewatch,
    isCompleted: completedLectures.includes(subSectionId),
  }
}


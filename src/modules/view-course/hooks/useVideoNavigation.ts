import { useRouter, useParams } from "next/navigation"
import { Section, SubSection } from "../types"

/**
 * Custom hook for video navigation logic
 * Separates navigation logic from component
 */
export const useVideoNavigation = (courseSectionData: Section[]) => {
  const router = useRouter()
  const params = useParams()
  const { courseId, sectionId, subSectionId } = params as {
    courseId: string
    sectionId: string
    subSectionId: string
  }

  const isFirstVideo = (): boolean => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection.findIndex((data: SubSection) => data._id === subSectionId)

    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const isLastVideo = (): boolean => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx]?.subSection.length || 0

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection.findIndex((data: SubSection) => data._id === subSectionId)

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx]?.subSection.length || 0

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection.findIndex((data: SubSection) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection[
          currentSubSectionIndx + 1
        ]?._id

      router.push(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else if (courseSectionData[currentSectionIndx + 1]) {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]?._id
      router.push(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection.findIndex((data: SubSection) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection[
          currentSubSectionIndx - 1
        ]?._id

      router.push(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else if (courseSectionData[currentSectionIndx - 1]) {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]?._id
      router.push(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  return {
    isFirstVideo,
    isLastVideo,
    goToNextVideo,
    goToPrevVideo,
  }
}


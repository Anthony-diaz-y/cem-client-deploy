import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Section } from "../types"

/**
 * Custom hook for sidebar state management
 * Separates sidebar state logic from component
 */
export const useSidebarState = (courseSectionData: Section[]) => {
  const params = useParams()
  const sectionId = params?.sectionId as string
  const subSectionId = params?.subSectionId as string

  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")

  useEffect(() => {
    if (!courseSectionData.length) return

    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId)
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[
        currentSubSectionIndx
      ]?._id

    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id || "")
    setVideoBarActive(activeSubSectionId || "")
  }, [courseSectionData, sectionId, subSectionId])

  return {
    activeStatus,
    videoBarActive,
    setActiveStatus,
    setVideoBarActive,
  }
}


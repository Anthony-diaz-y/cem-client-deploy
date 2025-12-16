'use client'

import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "next/navigation"
import { RootState } from "@shared/store/store"

import ConfirmationModal from "@shared/components/ConfirmationModal"
import Footer from "@shared/components/Footer"
import CourseDetailsCard from "../components/CourseDetailsCard"
import CourseHero from "../components/CourseHero"
import CourseInfoSection from "../components/CourseInfoSection"
import CourseContentSection from "../components/CourseContentSection"
import CourseAuthorSection from "../components/CourseAuthorSection"
import CourseLoadingSkeleton from "../components/CourseLoadingSkeleton"

import { useCourseDetails } from "../hooks/useCourseDetails"
import { useCourseCalculations } from "../hooks/useCourseCalculations"
import { useCourseActions } from "../hooks/useCourseActions"

/**
 * CourseDetailsContainer - Container component for Course Details page
 * Orchestrates business logic through custom hooks and delegates rendering to presentational components
 */
const CourseDetailsContainer = () => {
  const { courseId } = useParams()
  const { loading } = useSelector((state: RootState) => state.profile)
  const { paymentLoading } = useSelector((state: RootState) => state.course)

  // Custom hooks for data fetching, calculations, and actions
  const { response, loading: courseLoading } = useCourseDetails()
  const { avgReviewCount, totalNoOfLectures } = useCourseCalculations(response)
  const {
    isActive,
    confirmationModal,
    setConfirmationModal,
    handleActive,
    handleBuyCourse,
    handleAddToCart,
    handleCollapseAll,
  } = useCourseActions(courseId, response?.data?.courseDetails)

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [])

  // Loading state
  if (paymentLoading || loading || courseLoading || !response) {
    return <CourseLoadingSkeleton />
  }

  const { courseDetails } = response.data
  const { whatYouWillLearn, tag, instructor } = courseDetails

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        <CourseHero
          course={courseDetails}
          avgReviewCount={avgReviewCount}
          onBuyCourse={handleBuyCourse}
          onAddToCart={handleAddToCart}
        />

        {/* Desktop floating card */}
        <div className="right-[1.5rem] top-[60px] mx-auto hidden lg:block lg:absolute min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0">
          <CourseDetailsCard
            course={courseDetails}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse}
          />
        </div>
      </div>

      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          <CourseInfoSection
            whatYouWillLearn={whatYouWillLearn}
            tag={tag}
          />

          <CourseContentSection
            response={response}
            totalNoOfLectures={totalNoOfLectures}
            isActive={isActive}
            handleActive={handleActive}
            onCollapseAll={handleCollapseAll}
          />

          <CourseAuthorSection instructor={instructor} />
        </div>
      </div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetailsContainer


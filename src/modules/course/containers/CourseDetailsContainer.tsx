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
import RatingStats from "../components/RatingStats"
import ReviewForm from "../components/ReviewForm"
import CourseReviews from "../components/CourseReviews"

import { useCourseDetails } from "../hooks/useCourseDetails"
import { useCourseCalculations } from "../hooks/useCourseCalculations"
import { useCourseActions } from "../hooks/useCourseActions"
import { useCourseReviews } from "../hooks/useCourseReviews"

/**
 * CourseDetailsContainer - Container component for Course Details page
 * Orchestrates business logic through custom hooks and delegates rendering to presentational components
 */
const CourseDetailsContainer = () => {
  const { courseId } = useParams()
  const { loading } = useSelector((state: RootState) => state.profile)
  const { paymentLoading } = useSelector((state: RootState) => state.course)
  const { token } = useSelector((state: RootState) => state.auth)

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

  // Hook para manejar reseñas
  const {
    userReview,
    canReview,
    handleReviewSuccess,
  } = useCourseReviews(courseId, response?.data?.courseDetails)

  // Normalizar courseId para los componentes de reseñas
  const normalizedCourseId = Array.isArray(courseId) ? courseId[0] : courseId

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

  // Verificar estructura de respuesta antes de desestructurar
  if (!response.data || !response.data.courseDetails) {
    console.error("Invalid response structure: courseDetails not found");
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

          {/* Sección de Reseñas y Calificaciones */}
          <div className="mt-12 space-y-8 mb-20">
            {/* Estadísticas de Calificación */}
            {normalizedCourseId && (
              <RatingStats courseId={normalizedCourseId} />
            )}

            {/* Formulario de Reseña (solo para estudiantes inscritos) */}
            {canReview && token && normalizedCourseId && (
              <div className="review-section">
                <ReviewForm
                  courseId={normalizedCourseId}
                  existingReview={userReview}
                  onSuccess={handleReviewSuccess}
                  token={token}
                />
              </div>
            )}

            {/* Lista de Reseñas */}
            {normalizedCourseId && (
              <CourseReviews courseId={normalizedCourseId} />
            )}
          </div>
        </div>
      </div>

      {/* Footer con espacio adicional */}
      <div className="mt-20">
        <Footer />
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetailsContainer


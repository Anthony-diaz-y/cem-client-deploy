"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@shared/store/store";

import { ConfirmationModal } from "@shared/components";
import {
  CourseDetailsCard,
  CourseHero,
  CourseInfoSection,
  CourseAuthorSection,
} from "../components/details";
import { CourseContentSection } from "../components/content";
import { CourseLoadingSkeleton } from "../components/loading";
import { FloatingWhatsApp } from "@shared/components";

import { useCourseDetails } from "../hooks/useCourseDetails";
import { useCourseCalculations } from "../hooks/useCourseCalculations";
import { useCourseActions } from "../hooks/useCourseActions";

/**
 * CourseDetailsContainer - Container component for Course Details page
 */
const CourseDetailsContainer = () => {
  const { courseId } = useParams();
  const { loading } = useSelector((state: RootState) => state.profile);
  const { paymentLoading } = useSelector((state: RootState) => state.course);

  const { response, loading: courseLoading, showSkeleton } = useCourseDetails();
  const { avgReviewCount, totalNoOfLectures } = useCourseCalculations(response);
  const {
    isActive,
    confirmationModal,
    setConfirmationModal,
    handleActive,
    handleBuyCourse,
    handleAddToCart,
    handleCollapseAll,
  } = useCourseActions(courseId, response?.data?.courseDetails);

  // Estado para controlar cuándo el contenido está listo para mostrarse
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Efecto para activar la animación cuando el contenido esté listo
  useEffect(() => {
    if (!courseLoading && response?.data?.courseDetails) {
      // Pequeño delay para asegurar que el DOM esté listo
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsContentReady(false);
    }
  }, [courseLoading, response]);

  // Solo mostrar skeleton si paymentLoading está activo o si showSkeleton es true
  // Esto evita el parpadeo cuando la carga es muy rápida
  if (
    paymentLoading ||
    loading ||
    (showSkeleton && courseLoading) ||
    !response
  ) {
    return <CourseLoadingSkeleton />;
  }

  if (!response.data || !response.data.courseDetails) {
    return <CourseLoadingSkeleton />;
  }

  const { courseDetails } = response.data;
  const { whatYouWillLearn, instructor, instructors } = courseDetails;

  return (
    <>
      <div
        className={`relative min-h-screen bg-cem-neutral-white course-details-enter ${isContentReady ? "opacity-100" : "opacity-0"
          } course-details-transition`}
      >
        {/* 1. Top Section - Blue Background (Hero) */}
        <div className="w-full bg-cem-celeste-light mt-20 border-b border-transparent course-hero-enter">
          <div className="mx-auto max-w-[1260px] px-4 pt-10 pb-10 lg:pt-14 lg:pb-14">
            <div className="w-full lg:max-w-[760px]">
              <CourseHero
                course={courseDetails}
                avgReviewCount={avgReviewCount}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - Rendered between Hero and Content */}
        <div className="lg:hidden px-4 -mt-4 mb-8 relative z-20 course-sidebar-enter">
          <CourseDetailsCard
            course={courseDetails}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse}
            handleAddToCart={handleAddToCart}
            isEnrolled={response.data.isEnrolled}
          />
        </div>

        {/* 2. Bottom Section - White Background (Content) */}
        <div className="w-full bg-white course-content-enter">
          <div className="mx-auto max-w-[1260px] px-4 pb-16 pt-8 lg:pt-12">
            <div className="w-full lg:max-w-[760px] space-y-8 lg:space-y-12">
              <CourseInfoSection
                whatYouWillLearn={whatYouWillLearn}
              />

              <CourseContentSection
                response={response}
                totalNoOfLectures={totalNoOfLectures}
                isActive={isActive}
                handleActive={handleActive}
                onCollapseAll={handleCollapseAll}
              />

              <CourseAuthorSection instructor={instructor} instructors={instructors} />
            </div>
          </div>
        </div>

        {/* 3. Desktop Sidebar Overlay */}
        <div className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none z-30 course-sidebar-enter">
          <div className="mx-auto max-w-[1260px] px-4 h-full relative">
            {/* Position Sidebar on the right */}
            <div className="absolute right-4 top-0 bottom-5">
              <div className="sticky top-24 pt-20 w-[380px] pointer-events-auto">
                <CourseDetailsCard
                  course={courseDetails}
                  setConfirmationModal={setConfirmationModal}
                  handleBuyCourse={handleBuyCourse}
                  handleAddToCart={handleAddToCart}
                  isEnrolled={response.data.isEnrolled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingWhatsApp />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default CourseDetailsContainer;

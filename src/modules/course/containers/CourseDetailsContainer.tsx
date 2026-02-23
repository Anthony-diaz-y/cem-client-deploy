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
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [courseLoading, response]);

  // Solo mostrar skeleton si paymentLoading está activo o si showSkeleton es true
  if (
    paymentLoading ||
    loading ||
    (showSkeleton && courseLoading) ||
    !response ||
    !response.data ||
    !response.data.courseDetails
  ) {
    return <CourseLoadingSkeleton />;
  }

  const { courseDetails } = response.data;
  const { whatYouWillLearn, instructor, instructors } = courseDetails;

  return (
    <>
      <div
        className={`relative min-h-screen bg-cem-neutral-white mt-20 course-details-enter ${isContentReady ? "opacity-100" : "opacity-0"
          } course-details-transition`}
      >
        {/* Fondo decorativo del Hero (Solo azul superior) */}
        <div className="absolute top-0 left-0 w-full h-[290px] bg-cem-celeste-light border-b border-transparent pointer-events-none" />

        {/* Contenedor Principal en 2 Columnas */}
        <div className="relative mx-auto max-w-[1260px] px-4 lg:px-16 xl:px-10">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Columna Izquierda: Información del Curso */}
            <div className="w-full lg:max-w-[760px] flex-1">
              {/* Cabecera (Hero Content) */}
              <div className="pt-10 pb-10 lg:pt-14 lg:pb-14">
                <CourseHero
                  course={courseDetails}
                  avgReviewCount={avgReviewCount}
                />
              </div>

              {/* Sidebar Móvil (solo se ve en pantallas pequeñas) */}
              <div className="lg:hidden -mt-4 mb-8">
                <CourseDetailsCard
                  course={courseDetails}
                  setConfirmationModal={setConfirmationModal}
                  handleBuyCourse={handleBuyCourse}
                  handleAddToCart={handleAddToCart}
                  isEnrolled={response.data.isEnrolled}
                />
              </div>

              {/* Secciones de Información y Contenido */}
              <div className="space-y-8 lg:space-y-12 pb-20">
                <CourseInfoSection
                  whatYouWillLearn={whatYouWillLearn}
                  tag={courseDetails.tag}
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

            {/* Columna Derecha: Tarjeta de Precio y Compra (Sticky) */}
            <div className="hidden lg:block w-[410px] flex-shrink-0 relative">
              <div className="sticky top-28 pt-12">
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
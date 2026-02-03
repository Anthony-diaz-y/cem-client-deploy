import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { StarRating } from "@shared/components";
import { CartItem } from "@modules/course/types";
import { useCartCourses } from "../hooks/useCartCourses";
import { CourseThumbnail } from "./CourseThumbnail";
import { CART_TEXTS } from "../constants/cart.constants";

export default function RenderCartCourses() {
  const {
    cart,
    handleBuyCourse,
    handleRemoveCourse,
    getCourseId,
    calculateRating,
    formatPrice,
  } = useCartCourses();

  // Validar que cart existe y tiene elementos
  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <p className="text-center text-richblack-400 py-8">
          {CART_TEXTS.noCourses}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course: CartItem, indx: number) => {
        const courseId = getCourseId(course, indx);
        const { rating, totalReviews } = calculateRating(course);

        return (
          <div
            key={courseId}
            className={`flex w-full items-center gap-3 sm:gap-4 ${
              indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-4"
            } ${indx !== 0 && "pt-4"} `}
          >
            {/* course thumbnail - tamaño fijo y consistente para todas las imágenes */}
            <div className="flex-shrink-0 h-[70px] w-[105px] sm:h-[80px] sm:w-[120px] rounded-md overflow-hidden bg-richblack-900 relative">
              <CourseThumbnail
                thumbnail={course?.thumbnail}
                courseName={course?.courseName}
              />
            </div>

            {/* Información del curso - flex-1 para ocupar el espacio restante */}
            <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-2">
              <p className="text-base sm:text-lg font-medium text-richblack-5 line-clamp-2">
                {course?.courseName}
              </p>
              <p className="text-xs sm:text-sm text-richblack-400">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-yellow-50 font-semibold text-sm">
                  {rating.toFixed(1)}
                </span>
                <StarRating rating={rating} readonly={true} starSize={14} />
                <span className="text-richblack-400 text-xs">
                  ({totalReviews})
                </span>
              </div>
            </div>

            {/* Precio, botón Buy Now individual y botón Remove - alineados a la derecha */}
            <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* Botón Buy Now individual */}
                <button
                  onClick={() => handleBuyCourse(course)}
                  className="flex items-center gap-x-1 rounded-md bg-yellow-50 text-richblack-900 py-1.5 px-3 hover:bg-yellow-100 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <span>{CART_TEXTS.buy}</span>
                </button>

                {/* Botón Remove */}
                <button
                  onClick={() => handleRemoveCourse(course)}
                  className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-1.5 px-2.5 text-pink-200 hover:bg-richblack-600 transition-colors text-xs sm:text-sm"
                >
                  <RiDeleteBin6Line size={14} />
                  <span className="hidden sm:inline">{CART_TEXTS.remove}</span>
                </button>
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-yellow-100 whitespace-nowrap">
                $ {formatPrice(course?.price)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

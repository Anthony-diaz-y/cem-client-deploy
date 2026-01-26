"use client";

import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { GiReturnArrow } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { RatingStars, Img } from "@shared/components";
import { formatDate } from "@shared/utils/formatDate";
import { CourseHeroProps } from "../types";
import { COURSE_TEXTS } from "../constants/course.constants";

/**
 * CourseHero - Hero section component for course details page
 * Displays course thumbnail, title, description, rating, and action buttons
 */
const CourseHero: React.FC<CourseHeroProps> = ({
  course,
  avgReviewCount,
  onBuyCourse,
  onAddToCart,
}) => {
  const router = useRouter();
  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = course;

  return (
    <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
      <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
        {/* Go back button */}
        <div
          className="mb-5 lg:mt-10 lg:mb-0 z-[100]"
          onClick={() => router.back()}
        >
          <GiReturnArrow className="w-10 h-10 text-yellow-100 hover:text-yellow-50 cursor-pointer" />
        </div>

        {/* Mobile thumbnail */}
        <div className="relative block max-h-[30rem] lg:hidden">
          <Img
            src={thumbnail}
            alt="course thumbnail"
            className="aspect-auto w-full rounded-2xl"
          />
          <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
        </div>

        {/* Course data */}
        <div
          className={`mb-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
        >
          <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
            {courseName}
          </p>
          <p className="text-richblack-200">{courseDescription}</p>
          <div className="text-md flex flex-wrap items-center gap-2">
            <span className="text-yellow-25">
              {avgReviewCount > 0 ? Math.max(0, Math.min(5, avgReviewCount)).toFixed(1) : "0"}
            </span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
            <span>{`(${ratingAndReviews.length} ${ratingAndReviews.length === 1 ? COURSE_TEXTS.hero.review.singular : COURSE_TEXTS.hero.review.plural})`}</span>
            <span>{`${studentsEnrolled.length} ${studentsEnrolled.length === 1 ? COURSE_TEXTS.hero.student.singular : COURSE_TEXTS.hero.student.plural}`}</span>
          </div>
          <p className="capitalize">
            {" "}
            {COURSE_TEXTS.hero.createdBy}{" "}
            <span className="font-semibold underline">
              {instructor.firstName} {instructor.lastName}
            </span>
          </p>
          <div className="flex flex-wrap gap-5 text-lg">
            <p className="flex items-center gap-2">
              <BiInfoCircle /> {COURSE_TEXTS.hero.createdOn} {formatDate(createdAt)}
            </p>
            <p className="flex items-center gap-2">
              <HiOutlineGlobeAlt /> {COURSE_TEXTS.hero.language}
            </p>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
          <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
            {COURSE_TEXTS.hero.pricePrefix} {price}
          </p>
          <button className="yellowButton" onClick={onBuyCourse}>
            {COURSE_TEXTS.hero.actions.buyNow}
          </button>
          <button onClick={onAddToCart} className="blackButton">
            {COURSE_TEXTS.hero.actions.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;

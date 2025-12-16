'use client'

import React from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { GiReturnArrow } from 'react-icons/gi'
import { useRouter } from "next/navigation"
import RatingStars from "../../../shared/components/RatingStars"
import Img from '../../../shared/components/Img'
import { formatDate } from "../../../shared/utils/formatDate"
import { Course } from "../types"

interface CourseHeroProps {
  course: Course & {
    _id: string | string[]
    instructor: Course['instructor'] & {
      additionalDetails?: {
        about?: string
      }
    }
  }
  avgReviewCount: number
  onBuyCourse: () => void
  onAddToCart: () => void
}

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
  const router = useRouter()
  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = course

  return (
    <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
      <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
        {/* Go back button */}
        <div className="mb-5 lg:mt-10 lg:mb-0 z-[100]" onClick={() => router.back()}>
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
        <div className={`mb-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}>
          <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">{courseName}</p>
          <p className='text-richblack-200'>{courseDescription}</p>
          <div className="text-md flex flex-wrap items-center gap-2">
            <span className="text-yellow-25">{avgReviewCount}</span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
            <span>{`(${ratingAndReviews.length} reviews)`}</span>
            <span>{`${studentsEnrolled.length} students enrolled`}</span>
          </div>
          <p className="capitalize"> Created By <span className="font-semibold underline">{instructor.firstName} {instructor.lastName}</span></p>
          <div className="flex flex-wrap gap-5 text-lg">
            <p className="flex items-center gap-2">
              <BiInfoCircle /> Created at {formatDate(createdAt)}
            </p>
            <p className="flex items-center gap-2"><HiOutlineGlobeAlt /> English</p>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
          <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">Rs. {price}</p>
          <button className="yellowButton" onClick={onBuyCourse}>Buy Now</button>
          <button onClick={onAddToCart} className="blackButton">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default CourseHero


import React, { useMemo } from "react"
// Icons
// import { FaRegStar, FaStar } from "react-icons/fa"
// import ReactStars from "react-rating-stars-component"
import Link from "next/link"

import GetAvgRating from "../../../shared/utils/avgRating"
import RatingStars from "../../../shared/components/RatingStars"
import Img from './../../../shared/components/Img';
import { CourseCardProps } from '../types'

function CourseCard({ course, Height }: CourseCardProps) {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const avgReviewCount = useMemo(() => {
    return GetAvgRating(course.ratingAndReviews)
  }, [course.ratingAndReviews])
  // console.log("count............", avgReviewCount)

  return (
    <div className='hover:scale-[1.03] transition-all duration-200 z-50 '>
      <Link href={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <Img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CourseCard

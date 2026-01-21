"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis";
import Img from "../ui/Img";
import StarRating from "../ui/StarRating";

interface User {
  firstName: string;
  lastName: string;
  image: string;
}

interface Course {
  courseName: string;
}

interface Review {
  user: User;
  course: Course;
  review: string;
  rating: string | number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

const ReviewSlider = () => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      try {
        const response = await apiConnector<ApiResponse<Review[]>>(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        
        if (response?.data?.success) {
          setReviews(response.data.data || []);
          setError(null);
        } else {
          setReviews([]);
          setError(response?.data?.message || "No se pudieron cargar las reseñas");
        }
      } catch (err: unknown) {
        const apiError = err as { response?: { data?: { message?: string } }; message?: string };
        console.error("Error fetching reviews:", err);
        setReviews([]);
        setError(apiError?.response?.data?.message || apiError?.message || "Error al cargar las reseñas");
      }
    })();
  }, []);

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="text-white">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="w-full"
        >
          {reviews.map((review: Review, i: number) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 min-h-[180px] max-h-[180px] glass-bg">
                  <div className="flex items-center gap-4">
                    <Img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5 capitalize">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>

                  <p className="font-medium text-richblack-25">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>

                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-yellow-100">
                      {review.rating}
                    </h3>
                    <StarRating
                      rating={typeof review.rating === 'number' 
                        ? review.rating 
                        : (typeof review.rating === 'string' ? parseFloat(review.rating) : 0)}
                      readonly={true}
                      starSize={20}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;


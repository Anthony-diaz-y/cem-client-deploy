"use client";

import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";

import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";

import { addToCart } from "../store/cartSlice";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { Img } from "@shared/components";
import { CourseDetailsCardProps } from "../types";
import { RootState, AppDispatch } from "@shared/store/store";
import { COURSE_TEXTS } from "../constants/course.constants";

function CourseDetailsCard({
  course,
  setConfirmationModal,
  handleBuyCourse,
}: CourseDetailsCardProps) {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { thumbnail: ThumbnailImage, price: CurrentPrice } = course;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      copy(window.location.href);
      toast.success(COURSE_TEXTS.detailsCard.shareSuccess);
    }
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error(COURSE_TEXTS.actions.errors.instructorCannotBuy);
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: COURSE_TEXTS.actions.errors.notAuthenticated,
      text2: COURSE_TEXTS.actions.errors.loginToAddToCart,
      btn1Text: COURSE_TEXTS.actions.modal.login,
      btn2Text: COURSE_TEXTS.actions.modal.cancel,
      btn1Handler: () => router.push("/auth/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5 `}
      >
        {/* Course Image */}
        <Img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            {COURSE_TEXTS.detailsCard.pricePrefix} {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton outline-none"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => router.push("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? COURSE_TEXTS.detailsCard.goToCourse
                : COURSE_TEXTS.detailsCard.buyNow}
            </button>
            {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
              <button
                onClick={handleAddToCart}
                className="blackButton outline-none"
              >
                {COURSE_TEXTS.detailsCard.addToCart}
              </button>
            )}
          </div>

          <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            {COURSE_TEXTS.detailsCard.moneyBackGuarantee}
          </p>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              {COURSE_TEXTS.detailsCard.requirements}
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> {COURSE_TEXTS.detailsCard.share}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetailsCard;

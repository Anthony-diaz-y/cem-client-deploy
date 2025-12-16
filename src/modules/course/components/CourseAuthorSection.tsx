"use client";

import React from "react";
import { MdOutlineVerified } from "react-icons/md";
import Img from "@shared/components/Img";
import { CourseAuthorSectionProps } from "../types";

/**
 * CourseAuthorSection - Section component for author/instructor details
 * Displays instructor information and bio
 */
const CourseAuthorSection: React.FC<CourseAuthorSectionProps> = ({
  instructor,
}) => {
  return (
    <div className="mb-12 py-4">
      <p className="text-[28px] font-semibold">Author</p>
      <div className="flex items-center gap-4 py-4">
        <Img
          src={instructor.image || ""}
          alt="Author"
          className="h-14 w-14 rounded-full object-cover"
        />
        <div>
          <p className="text-lg capitalize flex items-center gap-2 font-semibold">
            {`${instructor.firstName} ${instructor.lastName}`}
            <span>
              <MdOutlineVerified className="w-5 h-5 text-[#00BFFF]" />
            </span>
          </p>
          <p className="text-richblack-50">
            {instructor?.additionalDetails?.about}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseAuthorSection;

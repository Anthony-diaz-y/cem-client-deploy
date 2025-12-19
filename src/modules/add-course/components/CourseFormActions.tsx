"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { MdNavigateNext } from "react-icons/md";
import IconBtn from "@shared/components/IconBtn";
import { setStep } from "@modules/course/store/courseSlice";
import { CourseFormActionsProps } from "../types";

/**
 * CourseFormActions - Actions component for course information form
 */
const CourseFormActions: React.FC<CourseFormActionsProps> = ({
  loading,
  editCourse,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-end gap-x-2">
      {editCourse && (
        <button
          onClick={() => dispatch(setStep(2))}
          disabled={loading}
          className="flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300"
        >
          Continuar Sin Guardar
        </button>
      )}
      <IconBtn disabled={loading} text={!editCourse ? "Siguiente" : "Guardar Cambios"}>
        <MdNavigateNext />
      </IconBtn>
    </div>
  );
};

export default CourseFormActions;

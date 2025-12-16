"use client";

import React from "react";

import { IoAddCircleOutline } from "react-icons/io5";
import IconBtn from "@shared/components/IconBtn";
import { SectionFormProps } from "../types";

/**
 * SectionForm - Form component for creating/editing sections
 */
const SectionForm: React.FC<SectionFormProps> = ({
  register,
  handleSubmit,
  errors,
  loading,
  editSectionName,
  onSubmit,
  onCancelEdit,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="sectionName">
          Section Name <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="sectionName"
          disabled={loading}
          placeholder="Add a section to build your course"
          {...register("sectionName", { required: true })}
          className="form-style w-full"
        />
        {errors.sectionName && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Section name is required
          </span>
        )}
      </div>

      <div className="flex items-end gap-x-4">
        <IconBtn
          type="submit"
          disabled={loading}
          text={editSectionName ? "Edit Section Name" : "Create Section"}
          outline={true}
        >
          <IoAddCircleOutline size={20} className="text-yellow-50" />
        </IconBtn>
        {editSectionName && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm text-richblack-300 underline"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default SectionForm;

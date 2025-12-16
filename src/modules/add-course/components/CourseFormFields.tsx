'use client'

import React from "react"
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import ChipInput from "./ChipInput"
import Upload from "./Upload"
import RequirementsField from "./RequirementField"
import { CourseInformationFormData } from "../types"
import { Course } from "../../course/types"

interface CourseFormFieldsProps {
  register: UseFormRegister<CourseInformationFormData>
  setValue: UseFormSetValue<CourseInformationFormData>
  errors: FieldErrors<CourseInformationFormData>
  courseCategories: Array<{ _id: string; name: string }>
  loading: boolean
  editCourse: boolean
  course?: Course | null
}

/**
 * CourseFormFields - Form fields component for course information
 */
const CourseFormFields: React.FC<CourseFormFieldsProps> = ({
  register,
  setValue,
  errors,
  courseCategories,
  loading,
  editCourse,
  course,
}) => {
  return (
    <>
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Price must be greater than or equal to 0"
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full cursor-pointer"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter or Comma"
        register={register as unknown as Parameters<typeof ChipInput>[0]['register']}
        errors={errors as unknown as Parameters<typeof ChipInput>[0]['errors']}
        setValue={setValue as unknown as Parameters<typeof ChipInput>[0]['setValue']}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register as unknown as Parameters<typeof Upload>[0]['register']}
        setValue={setValue as unknown as Parameters<typeof Upload>[0]['setValue']}
        errors={errors as unknown as Parameters<typeof Upload>[0]['errors']}
        editData={editCourse && course ? (course as Course).thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
      />
    </>
  )
}

export default CourseFormFields


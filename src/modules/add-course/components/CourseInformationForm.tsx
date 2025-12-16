import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../shared/services/courseDetailsAPI"
import {
  setCourse, setStep,
} from "../../course/store/courseSlice"
import { COURSE_STATUS } from "../../../shared/utils/constants"
import IconBtn from "../../../shared/components/IconBtn"
import Upload from "./Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"
import { RootState } from "../../../shared/store/store"
import { Course } from "../../course/types"
import { CourseInformationFormData } from '../types'

export default function CourseInformationForm() {

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<CourseInformationFormData>()

  const dispatch = useDispatch()
  const { token } = useSelector((state: RootState) => state.auth)
  const { course, editCourse } = useSelector((state: RootState) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState<Array<{ _id: string; name: string }>>([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        // console.log("categories", categories)
        setCourseCategories(categories)
      }
      setLoading(false)
    }
    // if form is in edit mode 
    // It will add value in input field
    if (editCourse && course) {
      const courseData = course as Course
      // console.log("editCourse ", editCourse)
      setValue("courseTitle", courseData.courseName)
      setValue("courseShortDesc", courseData.courseDescription)
      setValue("coursePrice", courseData.price)
      setValue("courseTags", courseData.tag)
      setValue("courseBenefits", courseData.whatYouWillLearn)
      setValue("courseCategory", courseData.category)
      setValue("courseRequirements", courseData.instructions)
      setValue("courseImage", courseData.thumbnail)
    }

    getCategories()
  }, [course, editCourse, setValue])



  const isFormUpdated = () => {
    if (!course) return false
    const courseData = course as Course
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== courseData.courseName ||
      currentValues.courseShortDesc !== courseData.courseDescription ||
      currentValues.coursePrice !== courseData.price ||
      currentValues.courseTags.toString() !== courseData.tag.toString() ||
      currentValues.courseBenefits !== courseData.whatYouWillLearn ||
      currentValues.courseCategory._id !== courseData.category._id ||
      currentValues.courseRequirements.toString() !== courseData.instructions.toString() ||
      currentValues.courseImage !== courseData.thumbnail) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data: CourseInformationFormData) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated() && course) {
        const courseData = course as Course
        const currentValues = getValues()
        const formData = new FormData()
        // console.log('data -> ',data)
        formData.append("courseId", courseData._id)
        if (currentValues.courseTitle !== courseData.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== courseData.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== courseData.price) {
          formData.append("price", data.coursePrice.toString())
        }
        if (currentValues.courseTags.toString() !== courseData.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
          // formData.append("tag", data.courseTags)
        }
        if (currentValues.courseBenefits !== courseData.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== courseData.category._id) {
          formData.append("category", data.courseCategory._id)
        }
        if (currentValues.courseRequirements.toString() !== courseData.instructions.toString()) {
          formData.append("instructions", JSON.stringify(data.courseRequirements))
        }
        if (currentValues.courseImage !== courseData.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

        // send data to backend
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    // user has visted first time to step 1 
    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice.toString())
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory._id)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 "
    >
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
          className="form-style resize-x-none min-h-[130px] w-full ] "
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
      <div className="flex flex-col space-y-2 ">
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

      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold
              text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}



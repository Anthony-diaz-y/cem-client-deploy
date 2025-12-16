import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  createSection,
  updateSection,
} from "../../../shared/services/courseDetailsAPI";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../course/store/courseSlice";

import IconBtn from "../../../shared/components/IconBtn";
import NestedView from "./NestedView";
import { RootState } from "../../../shared/store/store";
import { Course } from "../../course/types";
import { CourseBuilderFormData } from '../types';

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseBuilderFormData>();

  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState<string | null>(null); // stored section ID

  // handle form submission
  const onSubmit = async (data: CourseBuilderFormData) => {
    // console.log("sent data ", data)
    setLoading(true);

    let result;

    if (editSectionName && course) {
      const courseData = course as Course;
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: courseData._id,
        },
        token
      );
      // console.log("edit = ", result)
    } else if (course) {
      const courseData = course as Course;
      result = await createSection(
        { sectionName: data.sectionName, courseId: courseData._id },
        token
      );
    }
    // console.log("section result = ", result)
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  // cancel edit
  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  // Change Edit SectionName
  const handleChangeEditSectionName = (
    sectionId: string,
    sectionName: string
  ) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  // go To Next
  const goToNext = () => {
    if (!course) return;

    const courseData = course as Course;
    if (courseData.courseContent.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }
    if (
      courseData.courseContent.some(
        (section) => section.subSection.length === 0
      )
    ) {
      toast.error("Please add atleast one lecture in each section");
      return;
    }

    // all set go ahead
    dispatch(setStep(3));
  };

  // go Back
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section Name */}
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

        {/* Edit Section Name OR Create Section */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {/* if editSectionName mode is on */}
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* nesetd view of section - subSection */}
      {course && (course as Course).courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>

        {/* Next button */}
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}

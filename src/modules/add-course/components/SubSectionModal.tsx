import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
} from "@shared/services/courseDetailsAPI";
import { setCourse } from "../../course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { Course, Section, SubSection } from "../../course/types";
import { SubSectionModalFormData, SubSectionModalProps } from "../types/index";
import IconBtn from "@shared/components/IconBtn";
import Upload from "./Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}: SubSectionModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<SubSectionModalFormData>();

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const { course } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    if ((view || edit) && modalData && typeof modalData === "object") {
      const subSectionData = modalData as SubSection & { sectionId?: string };
      setValue("lectureTitle", subSectionData.title);
      setValue("lectureDesc", subSectionData.description);
      setValue("lectureVideo", subSectionData.videoUrl);
    }
  }, [view, edit, modalData, setValue]);

  // detect whether form is updated or not
  const isFormUpdated = () => {
    if (!modalData || typeof modalData === "string") return false;
    const currentValues = getValues();
    const subSectionData = modalData as SubSection & { sectionId?: string };
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== subSectionData.title ||
      currentValues.lectureDesc !== subSectionData.description ||
      currentValues.lectureVideo !== subSectionData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    if (!modalData || typeof modalData === "string" || !token || !course)
      return;
    const currentValues = getValues();
    const subSectionData = modalData as SubSection & { sectionId: string };
    const courseData = course as Course;
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData();
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", subSectionData.sectionId);
    formData.append("subSectionId", subSectionData._id);
    if (currentValues.lectureTitle !== subSectionData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== subSectionData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== subSectionData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = courseData.courseContent.map(
        (section: Section) =>
          section._id === subSectionData.sectionId ? result : section
      );
      const updatedCourse: Course = {
        ...courseData,
        courseContent: updatedCourseContent,
      };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data: SubSectionModalFormData) => {
    // console.log(data)
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    if (!modalData || typeof modalData !== "string" || !token || !course)
      return;
    const courseData = course as Course;
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);
    setLoading(true);
    const result = await createSubSection(formData, token);
    if (result) {
      // update the structure of course
      const updatedCourseContent = courseData.courseContent.map(
        (section: Section) => (section._id === modalData ? result : section)
      );
      const updatedCourse: Course = {
        ...courseData,
        courseContent: updatedCourseContent,
      };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={
              register as unknown as Parameters<typeof Upload>[0]["register"]
            }
            setValue={
              setValue as unknown as Parameters<typeof Upload>[0]["setValue"]
            }
            errors={errors as unknown as Parameters<typeof Upload>[0]["errors"]}
            video={true}
            viewData={
              view && modalData && typeof modalData === "object"
                ? (modalData as SubSection).videoUrl
                : null
            }
            editData={
              edit && modalData && typeof modalData === "object"
                ? (modalData as SubSection).videoUrl
                : null
            }
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

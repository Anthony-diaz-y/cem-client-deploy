import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import CourseBuilderForm from "../forms/CourseBuilderForm";
import CourseInformationForm from "../forms/CourseInformationForm";
import { COURSE_STEPS } from "../../constants/addCourse.constants";

export default function RenderSteps() {
  const { step, editCourse } = useSelector((state: RootState) => state.course);

  return (
    <>
      <div className="relative mb-2 flex w-full select-none justify-center ">
        {COURSE_STEPS.map((item) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center ">
              <div
                className={`grid  aspect-square w-[34px] place-items-center rounded-full border-[1px] 
                    ${step === item.id
                    ? "border-cem-primary bg-cem-primary text-white"
                    : "border-cem-neutral-gray-300 bg-cem-background text-cem-neutral-gray-500"
                  }
                    ${step > item.id && "bg-cem-primary text-white"}} `}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-white" />
                ) : (
                  item.id
                )}
              </div>
            </div>

            {item.id !== COURSE_STEPS.length && (
              <div
                className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${step > item.id ? "border-cem-primary" : "border-cem-neutral-gray-300"
                  } `}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative mb-16 flex w-full select-none justify-between">
        {COURSE_STEPS.map((item) => (
          <div
            className={`sm:min-w-[130px] flex flex-col items-center gap-y-2 ${editCourse && "sm:min-w-[270px]"
              }`}
            key={item.id}
          >
            <p
              className={`text-sm ${step >= item.id ? "text-cem-neutral-gray-900 font-medium" : "text-cem-neutral-gray-500"
                }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
    </>
  );
}

import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import CourseBuilderForm from "../forms/CourseBuilderForm";
import CourseInformationForm from "../forms/CourseInformationForm";
import { COURSE_STEPS } from "../../constants/addCourse.constants";

export default function RenderSteps() {
  const { step } = useSelector((state: RootState) => state.course);

  return (
    <>
      <div className="relative mb-4 flex w-full select-none justify-between items-start px-4 sm:px-10 max-w-[600px] mx-auto">
        {COURSE_STEPS.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center">
              <div
                className={`grid aspect-square w-10 place-items-center rounded-full border-2 transition-all duration-300 shadow-sm
                    ${step === item.id
                    ? "border-cem-primary bg-cem-primary text-white scale-110 shadow-cem-primary/20"
                    : step > item.id
                      ? "border-cem-primary bg-cem-primary text-white"
                      : "border-cem-neutral-gray-200 bg-white text-cem-neutral-gray-400"
                  }`}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-white text-sm" />
                ) : (
                  <span className="font-bold text-sm">{item.id}</span>
                )}
              </div>
              <p
                className={`text-[10px] sm:text-xs mt-3 text-center transition-colors duration-300 ${step >= item.id ? "text-cem-neutral-gray-900 font-semibold" : "text-cem-neutral-gray-400"
                  }`}
              >
                {item.title}
              </p>
            </div>

            {index !== COURSE_STEPS.length - 1 && (
              <div
                className={`mt-5 flex-1 h-[1px] border-dashed border-b-2 transition-all duration-500 mx-2 sm:mx-4 ${step > item.id ? "border-cem-primary" : "border-cem-neutral-gray-200"
                  }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>


      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
    </>
  );
}

"use client";

import React from "react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import ChipInput from "./ChipInput";
import Upload from "./Upload";
import RequirementsField from "./RequirementField";
import { CourseFormFieldsProps } from "../types";
import { Course } from "../../course/types";

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
          Título del Curso <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Ingresa el título del curso"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            El título del curso es requerido
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Descripción Corta del Curso <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Ingresa la descripción"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            La descripción del curso es requerida
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Precio del Curso <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Ingresa el precio del curso"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              min: {
                value: 0,
                message: "El precio debe ser mayor o igual a 0",
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            El precio del curso es requerido
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Categoría del Curso <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full cursor-pointer"
        >
          <option value="" disabled>
            Elige una Categoría
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => {
              // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
              const categoryId = (category as any)?.id || category?._id;
              if (!categoryId) return null; // No renderizar si no hay ID válido
              
              return (
                <option key={indx} value={categoryId}>
                  {category?.name}
                </option>
              );
            })}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            La categoría del curso es requerida
          </span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Etiquetas"
        name="courseTags"
        placeholder="Ingresa etiquetas y presiona Enter o Coma"
        register={
          register as unknown as Parameters<typeof ChipInput>[0]["register"]
        }
        errors={errors as unknown as Parameters<typeof ChipInput>[0]["errors"]}
        setValue={
          setValue as unknown as Parameters<typeof ChipInput>[0]["setValue"]
        }
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Miniatura del Curso"
        register={
          register as unknown as Parameters<typeof Upload>[0]["register"]
        }
        setValue={
          setValue as unknown as Parameters<typeof Upload>[0]["setValue"]
        }
        errors={errors as unknown as Parameters<typeof Upload>[0]["errors"]}
        editData={editCourse && course ? (course as Course).thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Beneficios del Curso <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Ingresa los beneficios del curso"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Los beneficios del curso son requeridos
          </span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requisitos/Instrucciones"
        register={register}
        setValue={setValue}
        errors={errors}
      />
    </>
  );
};

export default CourseFormFields;

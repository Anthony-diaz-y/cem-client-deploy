"use client";

import React from "react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import ChipInput from "./ChipInput";
import Upload from "../upload/Upload";
import RequirementsField from "./RequirementField";
import CourseInstructorSelect from "./CourseInstructorSelect";
import CourseCategorySelect from "./CourseCategorySelect";
import SyllabusUpload from "../upload/SyllabusUpload";
import { CourseFormFieldsProps } from "../../types";
import { Course } from "../../../course/types";

// Campos del formulario de información del curso
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
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseTitle">
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
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseShortDesc">
          Descripción Corta del Curso <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Ingresa la descripción"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none h-[103px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            La descripción del curso es requerida
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="coursePrice">
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
      <CourseCategorySelect
        name="courseCategory"
        label="Categoría del Curso"
        register={register}
        setValue={setValue}
        errors={errors}
        categories={courseCategories}
        initialData={
          Array.isArray(course?.category)
            ? (course?.category[0] as any)?.id || (course?.category[0] as any)?._id
            : (course?.category as any)?.id || (course?.category as any)?._id || (course?.category as unknown as string) || ""
        }
        loading={loading}
      />

      {/* Course Tags */}
      <ChipInput
        label="Etiquetas"
        name="courseTags"
        placeholder="Ingresa etiquetas y presiona Enter o Coma"
        register={register as UseFormRegister<any>}
        setValue={setValue as UseFormSetValue<any>}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Miniatura del Curso"
        register={register as UseFormRegister<any>}
        setValue={setValue as UseFormSetValue<any>}
        errors={errors as FieldErrors<any>}
        editData={editCourse && course ? (course as Course).thumbnail : null}
      />

      {/* Course Promotional Video Link */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseVideoUrl">
          Video Promocional (Link)
        </label>
        <input
          id="courseVideoUrl"
          placeholder="Ingresa el link del video promocional (YouTube, Vimeo, etc.)"
          {...register("courseVideoUrl")}
          className="form-style w-full"
        />
        {errors.courseVideoUrl && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            {errors.courseVideoUrl.message}
          </span>
        )}
      </div>

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseBenefits">
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

      {/* Instructor(es) del curso */}
      <CourseInstructorSelect
        name="courseInstructor"
        label="Docente(s) del curso"
        register={register}
        setValue={setValue}
        errors={errors}
        initialData={
          editCourse && course
            ? (course as any).instructors?.map((i: any) => i.id || i._id) || []
            : []
        }
      />

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requisitos/Instrucciones"
        register={register}
        setValue={setValue}
        errors={errors}
        initialData={editCourse && course ? (course as Course).instructions || [] : []}
      />

      {/* Course Syllabus PDF */}
      <SyllabusUpload
        name="courseSyllabus"
        label="Subir Syllabys"
        register={register as any}
        setValue={setValue as any}
        errors={errors}
        required={true}
        editData={editCourse && course ? (course as any).syllabus : null}
      />
    </>
  );
};

export default CourseFormFields;


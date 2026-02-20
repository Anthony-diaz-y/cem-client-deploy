"use client";

import React from "react";
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
      {/* 1. Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseTitle">
          Título del Curso <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Ejemplo:"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            El título del curso es requerido
          </span>
        )}
      </div>

      {/* 2. Course Description / Why take the course? */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseShortDesc">
          Descripción / ¿Por qué llevar el Curso? <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Ejemplo:"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none h-[103px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            La descripción del curso es requerida
          </span>
        )}
      </div>

      {/* 3. Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="coursePrice">
          Precio <sup className="text-pink-200">*</sup>
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
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg text-cem-neutral-gray-400 font-medium">$</span>
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            El precio del curso es requerido
          </span>
        )}
      </div>

      {/* 4. Course Category (Carrera) */}
      <CourseCategorySelect
        name="courseCategory"
        label="Carrera"
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

      {/* 5. Course Sector */}
      <CourseCategorySelect
        name="courseSector"
        label="Sector"
        register={register as any}
        setValue={setValue as any}
        errors={errors as any}
        categories={courseCategories}
        initialData={""}
        loading={loading}
      />

      {/* 6. Docente del curso */}
      <CourseInstructorSelect
        name="courseInstructor"
        label="Docente del curso"
        register={register}
        setValue={setValue}
        errors={errors}
        initialData={
          editCourse && course
            ? (course as any).instructors?.map((i: any) => i.id || i._id) || []
            : []
        }
      />

      {/* 7. Course Tags */}
      <ChipInput
        label="Etiquetas"
        name="courseTags"
        placeholder="Ingresa etiquetas presionando enter o coma"
        register={register as any}
        setValue={setValue as any}
      />

      {/* 8. Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Miniatura del Curso"
        register={register as any}
        setValue={setValue as any}
        errors={errors as any}
        editData={editCourse && course ? (course as Course).thumbnail : null}
      />

      {/* 9. Course Promotional Video Link */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseVideoUrl">
          Link del video promocional <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseVideoUrl"
          placeholder="Pega aquí la url del video de Youtube o Vimeo"
          {...register("courseVideoUrl")}
          className="form-style w-full"
        />
        {errors.courseVideoUrl && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            {errors.courseVideoUrl.message}
          </span>
        )}
      </div>

      {/* 10. Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-cem-neutral-gray-900 font-medium" htmlFor="courseBenefits">
          Beneficios del Curso <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Escribe aquí.."
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Los beneficios del curso son requeridos
          </span>
        )}
      </div>

      {/* 11. Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requisitos/Instrucciones"
        register={register}
        setValue={setValue}
        errors={errors}
        initialData={editCourse && course ? (course as Course).instructions || [] : []}
      />

      {/* 12. Course Syllabus PDF */}
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

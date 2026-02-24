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
import { getCategoryIds } from "../../hooks/useCourseInformationForm";

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
        <label
          className="text-sm text-cem-neutral-gray-900 font-medium"
          htmlFor="courseTitle"
        >
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
        <label
          className="text-sm text-cem-neutral-gray-900 font-medium"
          htmlFor="courseShortDesc"
        >
          Descripción / ¿Por qué llevar el Curso?{" "}
          <sup className="text-pink-200">*</sup>
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
      {/* 3. Course Prices (PEN & USD) - Split into Integer and Cents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Precio en PEN */}
        <div className="flex flex-col space-y-2 text-left">
          <label
            className="text-sm text-cem-neutral-gray-900 font-medium"
            htmlFor="coursePrice_int"
          >
            Precio (PEN) <sup className="text-pink-200">*</sup>
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative w-32">
              <input
                id="coursePrice_int"
                placeholder="0"
                {...register("coursePrice_int", { required: true })}
                className="form-style w-32 !pl-10 text-right pr-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-", ","].includes(e.key) &&
                  e.preventDefault()
                }
                onBlur={(e) => {
                  if (!e.target.value) setValue("coursePrice_int" as any, "0");
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-cem-neutral-gray-400 font-bold">
                S/
              </span>
            </div>
            <span className="text-xl font-bold text-cem-neutral-gray-300">
              .
            </span>
            <div className="w-16">
              <input
                id="coursePrice_cents"
                placeholder="00"
                {...register("coursePrice_cents", {
                  required: true,
                  maxLength: 2,
                })}
                className="form-style w-16 p-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.value.length > 2)
                    target.value = target.value.slice(0, 2);
                }}
                onBlur={(e) => {
                  let val = e.target.value;
                  if (!val) val = "00";
                  if (val.length === 1) val = "0" + val;
                  setValue("coursePrice_cents" as any, val);
                }}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-", ","].includes(e.key) &&
                  e.preventDefault()
                }
              />
            </div>
          </div>
          {(errors.coursePrice_int || errors.coursePrice_cents) && (
            <span className="ml-1 text-[11px] tracking-wide text-pink-200">
              Campo requerido (ej: 0.00)
            </span>
          )}
        </div>

        {/* Precio en USD */}
        <div className="flex flex-col space-y-2 text-left">
          <label
            className="text-sm text-cem-neutral-gray-900 font-medium"
            htmlFor="coursePriceUSD_int"
          >
            Precio (USD){" "}
            <span className="text-xs text-cem-neutral-gray-400 font-normal ml-1">
              (Opcional)
            </span>
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative w-32">
              <input
                id="coursePriceUSD_int"
                placeholder="0"
                {...register("coursePriceUSD_int")}
                className="form-style w-32 !pl-10 text-right pr-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-", ","].includes(e.key) &&
                  e.preventDefault()
                }
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-cem-neutral-gray-400 font-medium">
                $
              </span>
            </div>
            <span className="text-xl font-bold text-cem-neutral-gray-300">
              .
            </span>
            <div className="w-16">
              <input
                id="coursePriceUSD_cents"
                placeholder="00"
                {...register("coursePriceUSD_cents", {
                  maxLength: 2,
                })}
                className="form-style w-16 p-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.value.length > 2)
                    target.value = target.value.slice(0, 2);
                }}
                onBlur={(e) => {
                  let val = e.target.value;
                  if (val && val.length === 1) {
                    setValue("coursePriceUSD_cents" as any, "0" + val);
                  }
                }}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-", ","].includes(e.key) &&
                  e.preventDefault()
                }
              />
            </div>
          </div>
          <p className="text-[10px] text-cem-neutral-gray-400 ml-1">
            Se calcula automáticamente si no se especifica.
          </p>
        </div>
      </div>
      {/* 4. Course Category (Carrera) */}
      <CourseCategorySelect
        name="courseCategory"
        label="Carrera"
        register={register}
        setValue={setValue}
        errors={errors}
        categories={courseCategories}
        initialData={getCategoryIds(course?.category).carreraId}
        loading={loading}
        domainName="Según tu carrera"
        categoryType="career"
        required={true}
      />
      {/* 5. Course Sector */}
      <CourseCategorySelect
        name="courseSector"
        label="Sector"
        register={register as any}
        setValue={setValue as any}
        errors={errors as any}
        categories={courseCategories}
        initialData={getCategoryIds(course?.category).sectorId}
        loading={loading}
        domainName="Según tu sector"
        categoryType="sector"
        required={false}
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
        <label
          className="text-sm text-cem-neutral-gray-900 font-medium"
          htmlFor="courseVideoUrl"
        >
          Link del video promocional <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseVideoUrl"
          placeholder="Pega aquí la url del video de Youtube o Vimeo"
          {...register("courseVideoUrl", {
            required: {
              value: true,
              message: "El link del video promocional es requerido",
            },
            pattern: {
              value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*$/,
              message: "El enlace debe ser de YouTube o Vimeo (ej: youtube.com/...)",
            },
          })}
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
        <label
          className="text-sm text-cem-neutral-gray-900 font-medium"
          htmlFor="courseBenefits"
        >
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
        initialData={
          editCourse && course ? (course as Course).instructions || [] : []
        }
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

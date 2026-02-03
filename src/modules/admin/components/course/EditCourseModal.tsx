"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AdminCourse, editCourseAdmin } from "@shared/services/adminAPI";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Img } from "@shared/components";

interface EditCourseModalProps {
  course: AdminCourse | null;
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EditCourseFormData {
  courseName: string;
  courseDescription: string;
  price: number;
  categoryId: string;
  thumbnailImage: File | string;
}

/**
 * Modal para editar un curso existente
 * Permite modificar nombre, descripción, precio, categoría y miniatura
 */
export default function EditCourseModal({
  course,
  token,
  isOpen,
  onClose,
  onSuccess,
}: EditCourseModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditCourseFormData>();

  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState<
    Array<{ id?: string; _id?: string; name: string }>
  >([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Carga las categorías disponibles
  useEffect(() => {
    const getCategories = async () => {
      try {
        const categories = await fetchCourseCategories();
        if (categories.length > 0) {
          setCourseCategories(categories);
        }
      } catch (error) {
        // Error manejado por el servicio
      }
    };

    if (isOpen) {
      getCategories();
    }
  }, [isOpen]);

  // Inicializa el formulario con los datos del curso
  useEffect(() => {
    if (course && isOpen) {
      setValue("courseName", course.courseName);
      setValue("courseDescription", course.courseDescription);
      setValue("price", course.price);
      // Normalizar el ID de categoría - Handle array structure by taking the first one (primary)
      // TODO: Support multi-select for categories
      const categoryId = Array.isArray(course.category)
        ? course.category[0]?.id || ""
        : (course.category as any)?.id || "";
      setValue("categoryId", categoryId);
      setValue("thumbnailImage", course.thumbnail || "");
      setThumbnailPreview(course.thumbnail || null);
    } else {
      reset();
      setThumbnailPreview(null);
    }
  }, [course, isOpen, setValue, reset]);

  // Maneja el cambio de imagen y muestra preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnailImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Envía los cambios del curso
  const onSubmit = async (data: EditCourseFormData) => {
    if (!course) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("courseId", course.id);
      formData.append("courseName", data.courseName);
      formData.append("courseDescription", data.courseDescription);
      formData.append("price", data.price.toString());

      // Normalizar categoryId (convertir a string y asegurar que no sea vacío)
      const newCategoryId = String(data.categoryId || "").trim();

      // Siempre enviar categoryId si está presente y es válido
      // Esto asegura que el backend reciba el cambio de categoría correctamente
      if (
        newCategoryId &&
        newCategoryId !== "undefined" &&
        newCategoryId !== ""
      ) {
        formData.append("categoryId", newCategoryId);
      }

      // Solo agregar thumbnailImage si es un archivo nuevo
      if (data.thumbnailImage instanceof File) {
        formData.append("thumbnailImage", data.thumbnailImage);
      }

      const result = await editCourseAdmin(course.id, formData, token);
      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-richblack-800 rounded-xl border border-richblack-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-richblack-800 border-b border-richblack-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-richblack-5">
            Editar Curso
          </h2>
          <button
            onClick={onClose}
            className="text-richblack-400 hover:text-richblack-5 transition-colors"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Course Name */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseName">
              Nombre del Curso <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="courseName"
              placeholder="Ingresa el nombre del curso"
              {...register("courseName", { required: true })}
              className="form-style w-full"
            />
            {errors.courseName && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                El nombre del curso es requerido
              </span>
            )}
          </div>

          {/* Course Description */}
          <div className="flex flex-col space-y-2">
            <label
              className="text-sm text-richblack-5"
              htmlFor="courseDescription"
            >
              Descripción del Curso <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="courseDescription"
              placeholder="Ingresa la descripción"
              {...register("courseDescription", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.courseDescription && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                La descripción del curso es requerida
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="price">
              Precio del Curso <sup className="text-pink-200">*</sup>
            </label>
            <div className="relative">
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ingresa el precio del curso"
                {...register("price", {
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
            {errors.price && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                {errors.price.message || "El precio del curso es requerido"}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="categoryId">
              Categoría <sup className="text-pink-200">*</sup>
            </label>
            <select
              id="categoryId"
              {...register("categoryId", { required: true })}
              className="form-style w-full"
            >
              <option value="">Selecciona una categoría</option>
              {courseCategories.map((category) => {
                const categoryId = category.id || category._id || "";
                return (
                  <option key={categoryId} value={categoryId}>
                    {category.name}
                  </option>
                );
              })}
            </select>
            {errors.categoryId && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                La categoría es requerida
              </span>
            )}
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5">
              Miniatura del Curso
            </label>
            <div className="space-y-4">
              {thumbnailPreview && (
                <div className="relative w-full max-w-xs">
                  <Img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-48 rounded-lg object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-style w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-richblack-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-200 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

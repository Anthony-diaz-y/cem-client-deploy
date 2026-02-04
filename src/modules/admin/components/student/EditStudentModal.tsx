"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Student, updateStudent } from "@shared/services/admin/students";
import { FiX } from "react-icons/fi";

interface EditStudentModalProps {
  student: Student;
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface EditStudentForm {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  active: boolean;
}

export default function EditStudentModal({
  student,
  token,
  isOpen,
  onClose,
  onUpdate,
}: EditStudentModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditStudentForm>();

  useEffect(() => {
    if (student) {
      setValue("firstName", student.name);
      setValue("email", student.email);
      setValue(
        "contactNumber",
        student.contactNumber || student.additionalDetails?.contactNumber || "",
      );
      setValue("active", student.active);
    }
  }, [student, setValue]);

  const onSubmit = async (data: EditStudentForm) => {
    try {
      const result = await updateStudent(
        student.id,
        {
          name: data.firstName,
          email: data.email,
          contactNumber: data.contactNumber,
        },
        token,
      );

      if (result) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[500px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold text-richblack-5">
            Editar Estudiante
          </p>
          <button
            onClick={onClose}
            className="text-richblack-5 hover:text-richblack-300 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm text-richblack-5">
              Nombre <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="firstName"
              placeholder="Ingresa el nombre"
              {...register("firstName", { required: true })}
              className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 border-b border-richblack-500"
            />
            {errors.firstName && (
              <span className="text-xs text-pink-200">
                El nombre es requerido
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm text-richblack-5">
              Apellido <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="lastName"
              placeholder="Ingresa el apellido"
              {...register("lastName", { required: true })}
              className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 border-b border-richblack-500"
            />
            {errors.lastName && (
              <span className="text-xs text-pink-200">
                El apellido es requerido
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-richblack-5">
              Email <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="email"
              placeholder="Ingresa el email"
              {...register("email", { required: true })}
              className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 border-b border-richblack-500"
            />
            {errors.email && (
              <span className="text-xs text-pink-200">
                El email es requerido
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contactNumber" className="text-sm text-richblack-5">
              Teléfono
            </label>
            <input
              id="contactNumber"
              placeholder="Ingresa el teléfono"
              {...register("contactNumber")}
              className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 border-b border-richblack-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-richblack-200 cursor-pointer px-[20px] py-[8px] font-semibold text-richblack-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-yellow-50 cursor-pointer px-[20px] py-[8px] font-semibold text-richblack-900 hover:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Guadar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";

import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";

import { addToCart } from "../store/cartSlice";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import Img from "@shared/components/Img";
import { CourseDetailsCardProps } from "../types";
import { RootState, AppDispatch } from "@shared/store/store";

function CourseDetailsCard({
  course,
  setConfirmationModal,
  handleBuyCourse,
}: CourseDetailsCardProps) {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { thumbnail: ThumbnailImage, price: CurrentPrice } = course;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      copy(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Eres un Instructor. No puedes comprar un curso.");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "¡No estás autenticado!",
      text2: "Por favor, inicia sesión para agregar al carrito",
      btn1Text: "Iniciar Sesión",
      btn2Text: "Cancelar",
      btn1Handler: () => router.push("/auth/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5 `}
      >
        {/* Course Image */}
        <Img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton outline-none"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => router.push("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Ir al Curso"
                : "Comprar Ahora"}
            </button>
            {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
              <button
                onClick={handleAddToCart}
                className="blackButton outline-none"
              >
                Agregar al Carrito
              </button>
            )}
          </div>

          <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            Garantía de devolución de dinero de 30 días
          </p>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              Requisitos del Curso:
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Compartir
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetailsCard;

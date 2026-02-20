"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HiOutlineDownload } from "react-icons/hi";
import { Img } from "@shared/components";
import { addToCart } from "../../store/cartSlice";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { CourseDetailsCardProps } from "../../types";
import { RootState, AppDispatch } from "@shared/store/store";
import { COURSE_TEXTS } from "../../constants/course.constants";
import { profileEndpoints, studentEndpoints } from "@shared/services/apis";
import { apiConnector } from "@shared/services/apiConnector";
import { getUserDetails } from "@shared/services/profileAPI";
import PaymentModal from "./PaymentModal";

/**
 * CourseDetailsCard - Sidebar card for course details
 * Displays video thumbnail, price, action buttons, requirements, and share
 * Styled to match Figma precisely (Gutter, Price labels, Node icons)
 */
function CourseDetailsCard({
  course,
  setConfirmationModal,
  isEnrolled,
}: CourseDetailsCardProps) {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { thumbnail, price, priceUSD } = course;
  const courseIdToBuy = course._id || (course as any).id;

  const onShare = () => {
    if (typeof window !== "undefined") {
      copy(window.location.href);
      toast.success(COURSE_TEXTS.detailsCard.shareSuccess);
    }
  };

  const onAddToCart = () => {
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error(COURSE_TEXTS.actions.errors.instructorCannotBuy);
      return;
    }
    if (user?.accountType === ACCOUNT_TYPE.ADMIN) {
      toast.error(COURSE_TEXTS.actions.errors.adminCannotBuy);
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: COURSE_TEXTS.actions.errors.notAuthenticated,
      text2: COURSE_TEXTS.actions.errors.loginToAddToCart,
      btn1Text: COURSE_TEXTS.actions.modal.login,
      btn2Text: COURSE_TEXTS.actions.modal.cancel,
      btn1Handler: () => router.push("/auth/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const createPayPalOrder = async () => {
    if (!token) {
      toast.error("Por favor, inicia sesión para comprar");
      router.push("/auth/login");
      return Promise.reject("Not authenticated");
    }

    try {
      const response = await apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
        coursesId: [courseIdToBuy],
      });
      if (response.data.orderId) return response.data.orderId;
      throw new Error("Order ID not found");
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || "";
      if (typeof errorMessage === "string" && (errorMessage.toLowerCase().includes("already enrolled"))) {
        toast.success("¡Ya estás inscrito!");
        window.location.href = "/dashboard/enrolled-courses";
        return Promise.reject("ALREADY_ENROLLED");
      }
      toast.error("No se pudo iniciar el pago");
      throw err;
    }
  };

  const onPayPalApprove = async (data: any) => {
    try {
      await apiConnector("POST", studentEndpoints.CAPTURE_PAYPAL_ORDER_API, {
        orderId: data.orderID
      });

      // Actualizar el estado global del usuario para reflejar la nueva inscripción
      if (token) {
        // Usamos una función simple para navegar si getUserDetails requiere una
        const navigate = (path: string) => router.push(path);
        dispatch(getUserDetails(token, navigate as any));
      }

      // Emitir evento global para que componentes como EnrolledCourses se recarguen
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("coursePurchased"));
      }

      toast.success("¡Compra exitosa!");
      router.push("/dashboard/enrolled-courses");
    } catch (err) {
      toast.error("Hubo un problema procesando la inscripción.");
      throw err;
    }
  };

  const isEnrolledInCourse = isEnrolled || (user && course?.studentsEnrolled?.some((studentId: any) =>
    String(studentId) === String(user._id) || String(studentId) === String(user.id)
  ));

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("<iframe")) {
      const match = url.match(/src="([^"]+)"/);
      if (match && match[1]) url = match[1];
    }
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const path = url.split("vimeo.com/")[1]?.split("?")[0];
      const parts = path?.split("/") || [];
      return `https://player.vimeo.com/video/${parts[0]}${parts[1] ? `?h=${parts[1]}` : ""}`;
    }
    return url;
  };

  const [showVideoModal, setShowVideoModal] = useState(false);
  const promoUrl = getEmbedUrl(course.promoVideoUrl || "");

  return (
    <div className="rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-cem-neutral-gray-100/60 overflow-hidden">
      <div className="p-[25px]">
        {/* Thumbnail with Gutter and EXACT 360x240px dimensions */}
        <div
          className="relative w-[360px] h-[240px] mx-auto bg-cem-neutral-gray-100 overflow-hidden rounded-xl group cursor-pointer mb-8"
          onClick={() => { if (promoUrl) setShowVideoModal(true); }}
        >
          <Img src={thumbnail} alt={course?.courseName} className="w-full h-full object-cover" />
          {promoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[15px] border-l-cem-primary border-b-[8px] border-b-transparent ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[32px] font-bold text-cem-primary tracking-tight">
              {COURSE_TEXTS.detailsCard.pricePrefix}{Number(price).toFixed(2)}
            </p>
            <span className="text-sm font-bold text-cem-neutral-gray-500 mt-2">PEN</span>
          </div>
          <div className="flex items-center gap-1.5 text-cem-neutral-gray-500">
            <p className="text-lg font-medium">$ {priceUSD ? Number(priceUSD).toFixed(2) : (price / 3.75).toFixed(2)}</p>
            <span className="text-[13px] font-medium opacity-80">USD (aprox.)</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3.5 mb-8">
          {isEnrolledInCourse ? (
            <div className="flex flex-col gap-3">
              <div className="w-full py-3.5 px-4 rounded-xl bg-cem-primary text-white font-bold text-center">
                {COURSE_TEXTS.detailsCard.alreadyEnrolled}
              </div>
              <button
                className="w-full py-3.5 px-4 rounded-xl border border-cem-neutral-gray-200 text-cem-neutral-gray-900 font-bold hover:bg-gray-50"
                onClick={() => router.push("/dashboard/enrolled-courses")}
              >
                {COURSE_TEXTS.detailsCard.goToCourse}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {user?.accountType !== ACCOUNT_TYPE.ADMIN && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                  <button
                    className="w-full h-[54px] rounded-xl bg-cem-primary text-white font-bold hover:bg-cem-primary-dark transition-all shadow-sm"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    {COURSE_TEXTS.detailsCard.buyNow}
                  </button>
                  <button
                    className="w-full py-3.5 px-4 rounded-xl border border-cem-neutral-gray-200 text-cem-neutral-gray-900 font-bold hover:bg-gray-50"
                    onClick={onAddToCart}
                  >
                    {COURSE_TEXTS.detailsCard.addToCart}
                  </button>
                </>
              )}
              {(user?.accountType === ACCOUNT_TYPE.ADMIN || user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) && (
                <div className="text-center p-4 rounded-xl bg-cem-neutral-gray-50 border border-cem-neutral-gray-100 italic text-cem-neutral-gray-500 text-sm">
                  {user.accountType === ACCOUNT_TYPE.ADMIN
                    ? "Los administradores no pueden inscribirse en cursos."
                    : "Los instructores no pueden inscribirse en cursos."}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Requirements */}
        {course?.instructions?.length > 0 && (
          <div className="mb-10">
            <p className="text-[17px] font-bold text-cem-neutral-gray-900 mb-4">{COURSE_TEXTS.detailsCard.requirements}</p>
            <ul className="space-y-3">
              {course.instructions.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-cem-neutral-gray-700 text-[15px] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-black mt-[9px] flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Syllabus */}
        {course?.syllabus && (
          <div className="mb-10">
            <a href={course.syllabus} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-cem-neutral-gray-50/50 border border-cem-neutral-gray-200 text-cem-neutral-gray-900 font-bold hover:bg-gray-100">
              <HiOutlineDownload className="text-xl" /> Descargar Syllabus
            </a>
          </div>
        )}

        {/* Share Button (Image 3 Icon: Square with arrow up) */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2.5 text-cem-primary font-bold text-[15px] group hover:scale-105 transition-transform" onClick={onShare}>
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-y-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span>{COURSE_TEXTS.detailsCard.share}</span>
          </button>
        </div>
      </div>

      {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} createPayPalOrder={createPayPalOrder} onPayPalApprove={onPayPalApprove} price={price} priceUSD={priceUSD} />}

      {showVideoModal && promoUrl && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowVideoModal(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe src={`${promoUrl}?autoplay=1`} title="Promo Video" className="w-full h-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default CourseDetailsCard;

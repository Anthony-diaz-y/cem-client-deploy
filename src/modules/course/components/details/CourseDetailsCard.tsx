"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HiOutlineShare } from "react-icons/hi";
import { Img } from "@shared/components";
import { addToCart } from "../../store/cartSlice";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { CourseDetailsCardProps } from "../../types";
import { RootState, AppDispatch } from "@shared/store/store";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { COURSE_TEXTS } from "../../constants/course.constants";
import { studentEndpoints } from "@shared/services/apis";
import { apiConnector } from "@shared/services/apiConnector";
import PaymentModal from "./PaymentModal";
import { resetCart } from "@modules/course/store/cartSlice"; // Used to clear cart if needed, though for single buy we might not need to reset EVERYTHING unless intent is clear. For consistency with other flows, we'll see. Actually, for single buy here, we might just want to enroll.


/**
 * CourseDetailsCard - Sidebar card for course details
 * Displays video thumbnail, price, action buttons, requirements, and share
 */
function CourseDetailsCard({
  course,
  setConfirmationModal,
  handleBuyCourse,
  handleAddToCart,
  isEnrolled,
}: CourseDetailsCardProps) {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [{ isPending }] = usePayPalScriptReducer();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { thumbnail, price, priceUSD } = course;
  // Asegurar que tenemos un ID válido, probando ambas propiedades comunes
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
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error(COURSE_TEXTS.actions.errors.instructorCannotBuy);
      return Promise.reject("Instructor cannot buy");
    }
    if (!token) {
      toast.error("Por favor, inicia sesión para comprar");
      router.push("/auth/login");
      return Promise.reject("Not authenticated");
    }

    const coursesToBuy = [courseIdToBuy];
    console.log("Iniciando compra PayPal para curso:", { name: course.courseName, id: courseIdToBuy });

    try {
      const response = await apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
        coursesId: coursesToBuy,
      });
      console.log("Orden creada con éxito:", response.data);
      const orderId = response.data.orderId;
      if (orderId) return orderId;
      throw new Error("Order ID not found");
    } catch (err: any) {
      console.error("Error creating individual order:", err);
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || "";

      if (typeof errorMessage === "string" && (errorMessage.toLowerCase().includes("already enrolled") || errorMessage.toLowerCase().includes("ya está inscrito"))) {
        toast.success("¡Ya estás inscrito! Redirigiendo...");
        window.location.href = "/dashboard/enrolled-courses";
        return Promise.reject("ALREADY_ENROLLED");
      }

      if (err.response?.status === 401) {
        toast.error("Sesión expirada.");
      } else {
        toast.error("No se pudo iniciar el pago");
      }
      throw err;
    }
  };

  const onPayPalApprove = async (data: any) => {
    console.log("Pago aprobado por PayPal. Capturando orden en backend...", data);
    try {
      const response: any = await apiConnector("POST", studentEndpoints.CAPTURE_PAYPAL_ORDER_API, {
        orderId: data.orderID
      });
      console.log("Captura exitosa:", response.data);
      toast.success("¡Compra exitosa!");
      router.push("/dashboard/enrolled-courses");
    } catch (err) {
      console.error("PayPal Capture Error:", err);
      toast.error("Hubo un problema procesando la inscripción.");
      throw err;
    }
  };

  // Check if user is enrolled (checking both prop and students list with string conversion for safety)
  const isEnrolledInCourse = isEnrolled || (user && course?.studentsEnrolled?.some((studentId: any) =>
    String(studentId) === String(user._id) || String(studentId) === String(user.id)
  ));

  // Helper para convertir links de YT a embed (básico)
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    // Para Vimeo u otros, habría que adaptar, por ahora devolvemos tal cual si no es YT
    return url;
  };

  const [showVideoModal, setShowVideoModal] = useState(false);
  const promoUrl = getEmbedUrl(course.promoVideoUrl || "");

  return (
    <div className="rounded-xl bg-cem-cardbackground shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden border border-cem-neutral-gray-100/50">
      {/* Video thumbnail with play button */}
      <div
        className="relative aspect-video bg-cem-neutral-gray-100 overflow-hidden group cursor-pointer"
        onClick={() => {
          if (promoUrl) setShowVideoModal(true);
        }}
      >
        <Img
          src={thumbnail}
          alt={course?.courseName}
          className="w-full h-full object-cover"
        />
        {/* Solo mostrar el Play si hay video */}
        {promoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 rounded-full bg-cem-cardbackground flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-cem-primary border-b-[10px] border-b-transparent ml-1" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 lg:p-8">
        {/* Price */}
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-end gap-2 mb-1">
            <p className="text-3xl font-bold text-cem-primary">
              {COURSE_TEXTS.detailsCard.pricePrefix}
              {price}
            </p>
            <span className="text-sm font-medium text-cem-neutral-gray-500 mb-1.5">
              PEN
            </span>
          </div>
          <div className="flex items-center gap-2 text-cem-neutral-gray-600">
            <p className="text-xl font-semibold">
              $ {priceUSD ? Number(priceUSD).toFixed(2) : (price / 3.75).toFixed(2)}
            </p>
            <span className="text-xs font-medium text-cem-neutral-gray-400">
              USD (aprox.)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mb-6">
          {isEnrolledInCourse ? (
            <div className="flex flex-col gap-3">
              {/* Status Indicator with Primary Style */}
              <div className="w-full py-3 px-4 rounded-lg bg-cem-primary text-white font-bold text-center shadow-sm">
                {COURSE_TEXTS.detailsCard.alreadyEnrolled}
              </div>

              {/* Navigation button with Secondary Style */}
              <button
                className="w-full py-3 px-4 rounded-lg border border-cem-neutral-gray-200 bg-cem-cardbackground text-cem-neutral-gray-900 font-bold hover:bg-cem-neutral-gray-50 transition-colors"
                onClick={() => router.push("/dashboard/enrolled-courses")}
              >
                {COURSE_TEXTS.detailsCard.goToCourse}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              {/* Buy Now Button that opens Modal */}
              <button
                className="w-full h-[48px] rounded-lg bg-cem-primary text-white font-bold flex items-center justify-center hover:bg-cem-primary-dark transition-colors shadow-sm active:scale-[0.98]"
                onClick={() => setShowPaymentModal(true)}
              >
                {COURSE_TEXTS.detailsCard.buyNow}
              </button>

              <button
                className="w-full py-3 px-4 rounded-lg border border-cem-neutral-gray-200 bg-cem-cardbackground text-cem-neutral-gray-900 font-bold hover:bg-cem-neutral-gray-50 transition-colors"
                onClick={onAddToCart}
              >
                {COURSE_TEXTS.hero.actions.addToCart}
              </button>
            </div>
          )}
        </div>

        {/* Modal Pago */}
        {showPaymentModal && (
          <PaymentModal
            onClose={() => setShowPaymentModal(false)}
            createPayPalOrder={createPayPalOrder}
            onPayPalApprove={onPayPalApprove}
            price={price}
            priceUSD={priceUSD}
          />
        )}

        {/* Requirements */}
        {course?.instructions?.length > 0 && (
          <div className="mb-8">
            <p className="text-base font-bold text-cem-neutral-gray-900 mb-3">
              {COURSE_TEXTS.detailsCard.requirements}
            </p>
            <ul className="space-y-2">
              {course.instructions.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-cem-neutral-gray-600 text-[15px]"
                >
                  <span className="text-cem-neutral-gray-400 mt-1.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share */}
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 text-cem-primary font-medium hover:underline"
            onClick={onShare}
          >
            <HiOutlineShare className="w-5 h-5" />
            {COURSE_TEXTS.detailsCard.share}
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && promoUrl && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <iframe
                src={`${promoUrl}?autoplay=1`}
                title="Promo Video"
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setShowVideoModal(false)} />
          </div>,
          document.body
        )
      }
    </div>
  );
}

export default CourseDetailsCard;

"use client";

import React from "react";
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
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { COURSE_TEXTS } from "../../constants/course.constants";
import { studentEndpoints } from "@shared/services/apis";
import { apiConnector } from "@shared/services/apiConnector";
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

  const isEnrolledInCourse = isEnrolled || (user && course?.studentsEnrolled?.includes((user as any)?._id || (user as any)?.id));

  return (
    <div className="rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
      {/* Video thumbnail with play button */}
      <div className="relative aspect-video bg-cem-neutral-gray-100 overflow-hidden group">
        <Img
          src={thumbnail}
          alt={course?.courseName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-cem-primary border-b-[10px] border-b-transparent ml-1" />
          </div>
        </div>
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
              <div className="w-full py-3 px-4 rounded-lg bg-[#008396] text-white font-bold text-center shadow-sm">
                {COURSE_TEXTS.detailsCard.alreadyEnrolled}
              </div>

              {/* Navigation button with Secondary Style */}
              <button
                className="w-full py-3 px-4 rounded-lg border border-cem-neutral-gray-200 bg-white text-cem-neutral-gray-900 font-bold hover:bg-gray-50 transition-colors"
                onClick={() => router.push("/dashboard/enrolled-courses")}
              >
                {COURSE_TEXTS.detailsCard.goToCourse}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              {/* PayPal Button for Direct Purchase */}
              <div className="relative z-0 group">
                {isPending ? (
                  <div className="w-full h-[48px] bg-cem-neutral-gray-100 animate-pulse rounded-lg" />
                ) : (
                  <div className="relative w-full h-[48px] rounded-lg overflow-hidden bg-[#008396]">
                    {/* 1. CAPA VISUAL: El diseño que tú pediste */}
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none">
                      Comprar ahora
                    </div>

                    {/* 2. CAPA FUNCIONAL (cuando acabe la configuracion poner opacity-[0.01]) */}
                    <div className="absolute inset-x-0 inset-y-0 z-20 opacity-[0.01] scale-[1.5] cursor-pointer">
                      <PayPalButtons
                        style={{
                          layout: "horizontal",
                          height: 48,
                          tagline: false,
                          shape: "rect",
                        }}
                        createOrder={(data, actions) => {
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

                          return apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
                            coursesId: coursesToBuy,
                          })
                            .then((response) => {
                              console.log("Orden creada con éxito:", response.data);
                              const orderId = response.data.orderId;
                              if (orderId) return orderId;
                              throw new Error("Order ID not found");
                            })
                            .catch((err) => {
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
                            });
                        }}
                        onApprove={(data, actions) => {
                          console.log("Pago aprobado por PayPal. Capturando orden en backend...", data);
                          return apiConnector("POST", studentEndpoints.CAPTURE_PAYPAL_ORDER_API, {
                            orderId: data.orderID
                          })
                            .then((response) => {
                              console.log("Captura exitosa:", response.data);
                              toast.success("¡Compra exitosa!");
                              router.push("/dashboard/enrolled-courses");
                            })
                            .catch((err) => {
                              console.error("PayPal Capture Error:", err);
                              toast.error("Hubo un problema procesando la inscripción.");
                              throw err;
                            });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                className="w-full py-3 px-4 rounded-lg border border-cem-neutral-gray-200 bg-white text-cem-neutral-gray-900 font-bold hover:bg-gray-50 transition-colors"
                onClick={onAddToCart}
              >
                {COURSE_TEXTS.hero.actions.addToCart}
              </button>
            </div>
          )}
        </div>

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
    </div>
  );
}

export default CourseDetailsCard;

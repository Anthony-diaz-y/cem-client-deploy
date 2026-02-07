import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { removeFromCart } from "@modules/course/store/cartSlice";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { StarRating } from "@shared/components";
import { CartItem } from "@modules/course/types";
import { useCartCourses } from "../hooks/useCartCourses";
import { CourseThumbnail } from "./CourseThumbnail";
import { CART_TEXTS } from "../constants/cart.constants";

export default function RenderCartCourses() {
  const {
    cart,
    handleBuyCourse,
    handleRemoveCourse,
    getCourseId,
    calculateRating,
    formatPrice,
  } = useCartCourses();

  const dispatch = useDispatch();
  const router = useRouter();
  const [{ isPending }] = usePayPalScriptReducer();

  // Validar que cart existe y tiene elementos
  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <p className="text-center text-richblack-400 py-8">
          {CART_TEXTS.noCourses}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course: CartItem, indx: number) => {
        const courseId = getCourseId(course, indx);
        const { rating, totalReviews } = calculateRating(course);

        return (
          <div
            key={courseId}
            className={`flex w-full items-center gap-3 sm:gap-4 ${indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-4"
              } ${indx !== 0 && "pt-4"} `}
          >
            {/* course thumbnail - tamaño fijo y consistente para todas las imágenes */}
            <div className="flex-shrink-0 h-[70px] w-[105px] sm:h-[80px] sm:w-[120px] rounded-md overflow-hidden bg-richblack-900 relative">
              <CourseThumbnail
                thumbnail={course?.thumbnail}
                courseName={course?.courseName}
              />
            </div>

            {/* Información del curso - flex-1 para ocupar el espacio restante */}
            <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-2">
              <p className="text-base sm:text-lg font-medium text-richblack-5 line-clamp-2">
                {course?.courseName}
              </p>
              <p className="text-xs sm:text-sm text-richblack-400">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-yellow-50 font-semibold text-sm">
                  {rating.toFixed(1)}
                </span>
                <StarRating rating={rating} readonly={true} starSize={14} />
                <span className="text-richblack-400 text-xs">
                  ({totalReviews})
                </span>
              </div>
            </div>

            {/* Precio, botón Buy Now individual y botón Remove - alineados a la derecha */}
            <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* Botón Buy Now individual */}
                {/* Botón Buy Now individual (PayPal) -> COMPRAR SOLO ESTE CURSO */}
                <div style={{ width: "150px", position: "relative", zIndex: 1 }}>
                  {isPending ? (
                    <div className="w-full h-[35px] bg-richblack-700 animate-pulse rounded-md" />
                  ) : (
                    <div className="relative w-full h-[35px] rounded-lg overflow-hidden bg-[#008396] group">
                      {/* Capa Visual */}
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold pointer-events-none group-hover:bg-[#007485] transition-all">
                        Comprar ahora
                      </div>

                      {/* Capa Funcional (PayPal Invisible) */}
                      <div className="absolute inset-x-0 inset-y-0 z-20 opacity-[0.01] scale-[2] cursor-pointer">
                        <PayPalButtons
                          style={{
                            layout: "horizontal",
                            height: 35,
                            tagline: false
                          }}
                          createOrder={(data, actions) => {
                            console.log("Creando orden individual PayPal para:", courseId);
                            return apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
                              coursesId: [courseId],
                            })
                              .then((response) => {
                                const orderId = response.data.orderId;
                                if (orderId) return orderId;
                                throw new Error("Order ID not found in response");
                              })
                              .catch((err) => {
                                console.error("Error creating individual order:", err);
                                const errorData = err.response?.data;
                                const errorMessage = errorData?.message || "";

                                if (
                                  typeof errorMessage === "string" &&
                                  (errorMessage.toLowerCase().includes("already enrolled") || errorMessage.toLowerCase().includes("ya está inscrito"))
                                ) {
                                  toast.success("¡Ya estás inscrito! Redirigiendo...");
                                  dispatch(removeFromCart(courseId));
                                  router.push("/dashboard/enrolled-courses");
                                  return Promise.reject("ALREADY_ENROLLED");
                                }

                                if (err.response?.status === 401) {
                                  toast.error("Sesión expirada.");
                                } else {
                                  toast.error("Error al iniciar pago individual");
                                }
                                throw err;
                              });
                          }}
                          onApprove={(data, actions) => {
                            return apiConnector("POST", studentEndpoints.CAPTURE_PAYPAL_ORDER_API, {
                              orderId: data.orderID
                            })
                              .then((response) => {
                                toast.success("¡Compra exitosa!");
                                dispatch(removeFromCart(courseId));
                                router.push("/dashboard/enrolled-courses");
                              })
                              .catch((err) => {
                                console.error("Error capturing individual order:", err);
                                toast.error("El pago falló");
                                throw err;
                              });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón Remove */}
                <button
                  onClick={() => handleRemoveCourse(course)}
                  className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-1.5 px-2.5 text-pink-200 hover:bg-richblack-600 transition-colors text-xs sm:text-sm"
                >
                  <RiDeleteBin6Line size={14} />
                  <span className="hidden sm:inline">{CART_TEXTS.remove}</span>
                </button>
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-yellow-100 whitespace-nowrap">
                $ {formatPrice(course?.price)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

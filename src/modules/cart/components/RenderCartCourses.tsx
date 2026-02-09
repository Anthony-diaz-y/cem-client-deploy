import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
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
import PaymentModal from "@modules/course/components/details/PaymentModal";

export default function RenderCartCourses() {
  const {
    cart,
    handleRemoveCourse,
    getCourseId,
    calculateRating,
    formatPrice,
  } = useCartCourses();

  const dispatch = useDispatch();
  const router = useRouter();
  const [{ isPending }] = usePayPalScriptReducer();

  // State for individual course payment
  const [selectedCourse, setSelectedCourse] = useState<CartItem | null>(null);

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

  const createPayPalOrder = async (course: CartItem) => {
    const courseId = course._id || (course as any).id;
    console.log("Creando orden individual PayPal para:", courseId);
    try {
      const response = await apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
        coursesId: [courseId],
      });
      const orderId = response.data.orderId;
      if (orderId) return orderId;
      throw new Error("Order ID not found in response");
    } catch (err: any) {
      console.error("Error creating individual order:", err);
      const errorMessage = err.response?.data?.message || "";

      if (
        typeof errorMessage === "string" &&
        (errorMessage.toLowerCase().includes("already enrolled") || errorMessage.toLowerCase().includes("ya está inscrito"))
      ) {
        toast.success("¡Ya estás inscrito! Redirigiendo...");
        dispatch(removeFromCart(courseId));
        router.push("/dashboard/enrolled-courses");
        return Promise.reject("ALREADY_ENROLLED");
      }

      toast.error(errorMessage || "Error al iniciar pago individual");
      throw err;
    }
  };

  const onPayPalApprove = async (data: any, course: CartItem) => {
    const courseId = course._id || (course as any).id;
    try {
      await apiConnector("POST", studentEndpoints.CAPTURE_PAYPAL_ORDER_API, {
        orderId: data.orderID
      });
      toast.success("¡Compra exitosa!");
      dispatch(removeFromCart(courseId));
      router.push("/dashboard/enrolled-courses");
      setSelectedCourse(null);
    } catch (err) {
      console.error("Error capturing individual order:", err);
      toast.error("El pago falló");
      throw err;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course: CartItem, indx: number) => {
        const courseId = getCourseId(course, indx);
        const { rating, totalReviews } = calculateRating(course);

        return (
          <div
            key={courseId}
            className={`flex w-full items-center gap-3 sm:gap-4 ${indx !== cart.length - 1 && "border-b border-cem-neutral-gray-100 pb-4"
              } ${indx !== 0 && "pt-4"} `}
          >
            {/* course thumbnail */}
            <div className="flex-shrink-0 h-[70px] w-[105px] sm:h-[80px] sm:w-[120px] rounded-md overflow-hidden bg-cem-neutral-gray-100 relative">
              <CourseThumbnail
                thumbnail={course?.thumbnail}
                courseName={course?.courseName}
              />
            </div>

            {/* Información del curso */}
            <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-2">
              <p className="text-base sm:text-lg font-medium text-cem-neutral-gray-900 line-clamp-2">
                {course?.courseName}
              </p>
              <p className="text-xs sm:text-sm text-cem-neutral-gray-500">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-cem-primary font-bold text-sm">
                  {rating.toFixed(1)}
                </span>
                <StarRating rating={rating} readonly={true} starSize={14} />
                <span className="text-cem-neutral-gray-400 text-xs">
                  ({totalReviews})
                </span>
              </div>
            </div>

            {/* Precio, botón Buy Now individual y botón Remove */}
            <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* Botón Buy Now individual */}
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="px-4 h-[35px] rounded-lg bg-cem-primary text-white text-xs font-bold hover:bg-cem-primary-dark transition-all shadow-sm"
                >
                  Comprar ahora
                </button>

                {/* Botón Remove */}
                <button
                  onClick={() => handleRemoveCourse(course)}
                  className="flex items-center gap-x-1 rounded-md border border-cem-neutral-gray-200 bg-white py-1.5 px-2.5 text-red-500 hover:bg-red-50 transition-colors text-xs sm:text-sm"
                >
                  <RiDeleteBin6Line size={14} />
                  <span className="hidden sm:inline">{CART_TEXTS.remove}</span>
                </button>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-cem-primary whitespace-nowrap">
                {formatPrice(course?.price)}
              </p>
            </div>
          </div>
        );
      })}

      {/* Modal para pago individual */}
      {selectedCourse && (
        <PaymentModal
          onClose={() => setSelectedCourse(null)}
          createPayPalOrder={(data, actions) => createPayPalOrder(selectedCourse)}
          onPayPalApprove={(data, actions) => onPayPalApprove(data, selectedCourse)}
          price={Number(selectedCourse.price)}
          priceUSD={Number(selectedCourse.price) / 3.75}
        />
      )}
    </div>
  );
}

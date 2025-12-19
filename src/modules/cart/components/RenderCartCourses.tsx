import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiBookOpen } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { removeFromCart } from "../../course/store/cartSlice";
import { CartItem } from "../../course/types";
import StarRating from "@shared/components/StarRating";
import { RootState, AppDispatch } from "@shared/store/store";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { setPaymentLoading } from "@modules/course/store/courseSlice";

// Componente para la imagen del curso con placeholder
const CourseThumbnail: React.FC<{ thumbnail?: string; courseName?: string }> = ({ thumbnail, courseName }) => {
  const [imageError, setImageError] = useState(!thumbnail);

  if (!thumbnail || imageError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-richblack-800 to-richblack-900 text-richblack-400">
        <HiBookOpen size={28} className="mb-1 opacity-60" />
        <span className="text-[10px] text-center px-1">Sin imagen</span>
      </div>
    );
  }

  return (
    <img
      src={thumbnail}
      alt={courseName || "course thumbnail"}
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
};

export default function RenderCartCourses() {
  const { cart } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Validar que cart existe y tiene elementos
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <p className="text-center text-richblack-400 py-8">
          No hay cursos en el carrito
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course: CartItem, indx: number) => {
        // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
        const courseId = (course as any)?.id || course?._id || `cart-item-${indx}`;
        
        return (
        <div
          key={courseId}
          className={`flex w-full items-center gap-3 sm:gap-4 ${
            indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-4"
          } ${indx !== 0 && "pt-4"} `}
        >
          {/* course thumbnail - tamaño fijo y consistente para todas las imágenes */}
          <div className="flex-shrink-0 h-[70px] w-[105px] sm:h-[80px] sm:w-[120px] rounded-md overflow-hidden bg-richblack-900 relative">
            <CourseThumbnail thumbnail={course?.thumbnail} courseName={course?.courseName} />
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
              {(() => {
                // Calcular rating promedio: priorizar averageRating del backend
                const avgRating = course?.averageRating 
                  ? parseFloat(course.averageRating.toString())
                  : (course?.ratingAndReviews && Array.isArray(course.ratingAndReviews) && course.ratingAndReviews.length > 0
                    ? course.ratingAndReviews
                        .filter((r: any) => r?.rating && typeof r.rating === 'number')
                        .reduce((sum: number, r: any) => sum + r.rating, 0) / course.ratingAndReviews.filter((r: any) => r?.rating).length
                    : 0);
                
                const displayRating = isNaN(avgRating) ? 0 : Math.min(Math.max(avgRating, 0), 5);
                const totalReviews = course?.totalReviews || (course?.ratingAndReviews?.length || 0);
                
                return (
                  <>
                    <span className="text-yellow-50 font-semibold text-sm">{displayRating.toFixed(1)}</span>
                    <StarRating
                      rating={displayRating}
                      readonly={true}
                      starSize={14}
                    />
                    <span className="text-richblack-400 text-xs">
                      ({totalReviews})
                    </span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Precio, botón Buy Now individual y botón Remove - alineados a la derecha */}
          <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              {/* Botón Buy Now individual */}
              <button
                onClick={async () => {
                  if (!token) {
                    toast.error("Por favor, inicia sesión para comprar");
                    router.push("/auth/login");
                    return;
                  }
                  
                  const courseIdToBuy = (course as any)?.id || course?._id;
                  if (!courseIdToBuy) {
                    toast.error("ID de curso no válido");
                    return;
                  }

                  const confirmed = window.confirm(
                    "⚠️ MODO TEMPORAL\n\n" +
                    "Esta compra no requiere pago real. Solo para pruebas y desarrollo.\n\n" +
                    "¿Deseas comprar este curso?"
                  );

                  if (!confirmed) return;

                  const toastId = toast.loading("Comprando curso...");
                  dispatch(setPaymentLoading(true));

                  try {
                    const response = await apiConnector(
                      "POST",
                      studentEndpoints.BUY_NOW_TEMPORARY_API,
                      { coursesId: [courseIdToBuy] },
                      {
                        Authorization: `Bearer ${token}`,
                      }
                    );

                    if (!response.data.success) {
                      throw new Error(response.data.message || "No se pudo comprar el curso");
                    }

                    toast.success("¡Curso comprado exitosamente!", { duration: 3000 });
                    
                    // Remover del carrito después de comprar
                    dispatch(removeFromCart(courseIdToBuy));
                    
                    setTimeout(() => {
                      router.push("/dashboard/enrolled-courses");
                    }, 1500);
                  } catch (error: any) {
                    const errorMessage =
                      error?.response?.data?.message ||
                      error?.message ||
                      "No se pudo comprar el curso";
                    toast.error(errorMessage);
                  } finally {
                    toast.dismiss(toastId);
                    dispatch(setPaymentLoading(false));
                  }
                }}
                className="flex items-center gap-x-1 rounded-md bg-yellow-50 text-richblack-900 py-1.5 px-3 hover:bg-yellow-100 transition-colors text-xs sm:text-sm font-semibold"
              >
                <span>Comprar</span>
              </button>
              
              {/* Botón Remove */}
              <button
                onClick={() => {
                  const courseIdToRemove = (course as any)?.id || course?._id;
                  if (courseIdToRemove) {
                    dispatch(removeFromCart(courseIdToRemove));
                  }
                }}
                className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-1.5 px-2.5 text-pink-200 hover:bg-richblack-600 transition-colors text-xs sm:text-sm"
              >
                <RiDeleteBin6Line size={14} />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-yellow-100 whitespace-nowrap">
              ₹ {(() => {
                const price = typeof course?.price === 'number' 
                  ? course.price 
                  : (typeof course?.price === 'string' ? parseFloat(course.price) : 0);
                return price.toFixed(2);
              })()}
            </p>
          </div>
        </div>
      );
      })}
    </div>
  );
}

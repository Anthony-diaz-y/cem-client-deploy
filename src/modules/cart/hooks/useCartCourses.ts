// Hook para manejar el estado y lógica de RenderCartCourses
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { removeFromCart } from "@modules/course/store/cartSlice";
import { CartItem } from "@modules/course/types";
import { RootState, AppDispatch } from "@shared/store/store";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { setPaymentLoading } from "@modules/course/store/courseSlice";
import type { BuyNowTemporaryResponse } from "@modules/course/types";

export interface UseCartCoursesReturn {
  cart: CartItem[];
  token: string | null;
  user: unknown;
  handleBuyCourse: (course: CartItem) => Promise<void>;
  handleRemoveCourse: (course: CartItem) => void;
  getCourseId: (course: CartItem, index: number) => string;
  calculateRating: (course: CartItem) => { rating: number; totalReviews: number };
  formatPrice: (price: unknown) => string;
}

export function useCartCourses(): UseCartCoursesReturn {
  const { cart } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const getCourseId = (course: CartItem, index: number): string => {
    return (course as { id?: string })?.id || course?._id || `cart-item-${index}`;
  };

  const calculateRating = (course: CartItem): { rating: number; totalReviews: number } => {
    // Calcular rating promedio: priorizar averageRating del backend
    const avgRating = course?.averageRating
      ? (typeof course.averageRating === 'number'
        ? course.averageRating
        : (typeof course.averageRating === 'string' ? parseFloat(course.averageRating) : 0))
      : (course?.ratingAndReviews && Array.isArray(course.ratingAndReviews) && course.ratingAndReviews.length > 0
        ? course.ratingAndReviews
          .filter((r: { rating?: number }) => r?.rating && typeof r.rating === 'number')
          .reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / course.ratingAndReviews.filter((r: { rating?: number }) => r?.rating).length
        : 0);

    const displayRating = isNaN(avgRating) ? 0 : Math.min(Math.max(avgRating, 0), 5);
    const totalReviews = course?.totalReviews || (course?.ratingAndReviews?.length || 0);

    return { rating: displayRating, totalReviews };
  };

  const formatPrice = (price: unknown): string => {
    const priceValue = typeof price === 'number'
      ? price
      : (typeof price === 'string' ? parseFloat(price) : 0);
    return priceValue.toFixed(2);
  };

  const handleBuyCourse = async (course: CartItem) => {
    if (!token) {
      toast.error("Por favor, inicia sesión para comprar");
      router.push("/auth/login");
      return;
    }

    const courseIdToBuy = (course as { id?: string })?.id || course?._id;
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
      const response = await apiConnector<BuyNowTemporaryResponse>(
        "POST",
        studentEndpoints.BUY_NOW_TEMPORARY_API,
        { coursesId: [courseIdToBuy] } as Record<string, unknown>,
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
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "No se pudo comprar el curso";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId);
      dispatch(setPaymentLoading(false));
    }
  };

  const handleRemoveCourse = (course: CartItem) => {
    const courseIdToRemove = (course as { id?: string })?.id || course?._id;
    if (courseIdToRemove) {
      dispatch(removeFromCart(courseIdToRemove));
      toast.success("Curso eliminado del carrito");
    }
  };

  return {
    cart: Array.isArray(cart) ? cart : [],
    token,
    user,
    handleBuyCourse,
    handleRemoveCourse,
    getCourseId,
    calculateRating,
    formatPrice,
  };
}



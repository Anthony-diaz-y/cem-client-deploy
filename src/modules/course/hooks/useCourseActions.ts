import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState, AppDispatch } from "@shared/store/store";
import { addToCart } from "../store/cartSlice";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { Course } from "../types";
import { type ConfirmationModalData } from "@shared/components";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { setPaymentLoading } from "../store/courseSlice";
import { resetCart } from "../store/cartSlice";
import { invalidateInstructorCache } from "@modules/instructor/hooks/useInstructorData";
import type { BuyNowTemporaryResponse } from "../types";
import { COURSE_TEXTS } from "../constants/course.constants";

// Helper to safely extract category name
const getCategoryName = (cat: any): string => {
  if (!cat) return "";
  if (Array.isArray(cat)) {
    return cat.length > 0 ? cat[0].name : "";
  }
  return cat.name || "";
};

/** Hook que maneja las acciones del curso: comprar, agregar al carrito, expandir/colapsar secciones */
export const useCourseActions = (
  courseId: string | string[] | undefined,
  course: Course | undefined,
) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [isActive, setIsActive] = useState<string[]>([]);

  /** Alterna el estado de expansión de una sección del curso */
  const handleActive = (id: string) => {
    setIsActive(!isActive.includes(id) ? [id] : []);
  };

  /** Colapsa todas las secciones del curso */
  const handleCollapseAll = () => {
    setIsActive([]);
  };

  /** TEMPORAL: Inscribe al estudiante directamente sin pasarela de pago */
  const enrollCourseDirectly = async (coursesId: string[]) => {
    const toastId = toast.loading(COURSE_TEXTS.actions.enrollment.loading);
    dispatch(setPaymentLoading(true));

    try {
      const response = await apiConnector<BuyNowTemporaryResponse>(
        "POST",
        studentEndpoints.BUY_NOW_TEMPORARY_API,
        { coursesId } as Record<string, unknown>,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || COURSE_TEXTS.actions.enrollment.error,
        );
      }

      toast.success(COURSE_TEXTS.actions.enrollment.success, {
        duration: 3000,
      });

      invalidateInstructorCache();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("instructorDataRefresh"));
      }

      router.push("/dashboard/enrolled-courses");
      dispatch(resetCart());
    } catch (error: any) {
      // No mostrar toast si es error 401 (el interceptor ya lo maneja)
      if (error?.response?.status === 401) {
        return;
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo inscribir al curso";

      // Si el estudiante ya está inscrito, tratarlo como éxito
      if (
        errorMessage.toLowerCase().includes("already enrolled") ||
        errorMessage.toLowerCase().includes("ya está inscrito")
      ) {
        toast.success(COURSE_TEXTS.actions.enrollment.alreadyEnrolled, {
          duration: 3000,
        });

        invalidateInstructorCache();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("instructorDataRefresh"));
        }

        dispatch(resetCart());
        setTimeout(() => {
          router.push("/dashboard/enrolled-courses");
        }, 1000);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      toast.dismiss(toastId);
      dispatch(setPaymentLoading(false));
    }
  };

  /** Maneja la compra del curso (actualmente usa inscripción directa temporal) */
  const handleBuyCourse = () => {
    if (token) {
      const normalizedCourseId = Array.isArray(courseId)
        ? courseId[0]
        : courseId;

      if (!normalizedCourseId) {
        toast.error(COURSE_TEXTS.actions.errors.invalidCourseId);
        return;
      }

      const coursesId = [String(normalizedCourseId)];

      // TEMPORAL: Mostrar advertencia antes de proceder
      const confirmed = window.confirm(
        `${COURSE_TEXTS.actions.temporary.warning}\n\n` +
          `${COURSE_TEXTS.actions.temporary.description}\n\n` +
          `${COURSE_TEXTS.actions.temporary.note}\n\n` +
          `${COURSE_TEXTS.actions.temporary.confirm}`,
      );

      if (confirmed) {
        enrollCourseDirectly(coursesId);
      }
      return;
    }

    setConfirmationModal({
      text1: COURSE_TEXTS.actions.errors.notAuthenticated,
      text2: COURSE_TEXTS.actions.errors.loginToBuy,
      btn1Text: COURSE_TEXTS.actions.modal.login,
      btn2Text: COURSE_TEXTS.actions.modal.cancel,
      btn1Handler: () => router.push("/auth/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  /** Agrega el curso al carrito de compras */
  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error(COURSE_TEXTS.actions.errors.instructorCannotBuy);
      return;
    }
    if (token && course) {
      const cartItem = {
        id: (course as any).id || course._id, // Handle both id formats
        _id: course._id || (course as any).id,
        courseName: course.courseName,
        price: course.price,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        courseDescription: course.courseDescription,
        category: {
          name: getCategoryName(course.category),
        },
        ratingAndReviews: course.ratingAndReviews,
        averageRating:
          typeof (course as any).averageRating === "number" ||
          typeof (course as any).averageRating === "string"
            ? (course as any).averageRating
            : undefined,
        totalReviews:
          typeof (course as any).totalReviews === "number"
            ? (course as any).totalReviews
            : undefined,
      };

      // We cast to any here because CartItem might not perfectly match the ad-hoc object structure
      // if there are optional/missing fields, but this covers the required ones.
      dispatch(addToCart(cartItem as any));
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

  return {
    isActive,
    confirmationModal,
    setConfirmationModal,
    handleActive,
    handleBuyCourse,
    handleAddToCart,
    handleCollapseAll,
  };
};

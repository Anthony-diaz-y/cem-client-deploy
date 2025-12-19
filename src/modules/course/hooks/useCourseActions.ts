import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState, AppDispatch } from "@shared/store/store";
import { buyCourse } from "@shared/services/studentFeaturesAPI";
import { addToCart } from "../store/cartSlice";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { Course } from "../types";
import { ConfirmationModalData } from "@shared/components/ConfirmationModal";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { setPaymentLoading } from "../store/courseSlice";
import { resetCart } from "../store/cartSlice";
import { invalidateInstructorCache } from "@modules/instructor/hooks/useInstructorData";

/**
 * Custom hook for course actions (buy, add to cart, active sections)
 * Separates action handlers from component
 */
export const useCourseActions = (
  courseId: string | string[] | undefined,
  course: Course | undefined
) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [isActive, setIsActive] = useState<string[]>([]);

  const handleActive = (id: string) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e !== id)
    );
  };

  // ================ TEMPORAL: Función para inscribir directamente sin pago ================
  // TODO: REMOVER ESTA FUNCIÓN CUANDO SE IMPLEMENTE LA PASARELA DE PAGO
  const enrollCourseDirectly = async (coursesId: string[]) => {
    const toastId = toast.loading("Inscribiendo al curso...");
    dispatch(setPaymentLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        studentEndpoints.BUY_NOW_TEMPORARY_API,
        { coursesId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "No se pudo inscribir al curso");
      }

      // Mostrar mensaje de éxito con advertencia temporal
      toast.success(
        response.data.message || "¡Curso agregado exitosamente! (Modo temporal - sin pago)",
        {
          duration: 5000,
        }
      );

      // Mostrar advertencia adicional si viene del backend
      if (response.data.warning) {
        toast(response.data.warning, {
          icon: "⚠️",
          duration: 6000,
        });
      }

      // Invalidar cache del instructor para que se actualicen los datos de estudiantes
      invalidateInstructorCache();
      
      // Disparar evento personalizado para refrescar datos del instructor
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("instructorDataRefresh"));
      }

      router.push("/dashboard/enrolled-courses");
      dispatch(resetCart());
    } catch (error: any) {
      console.log("ERROR AL INSCRIBIR AL CURSO (TEMPORAL)....", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo inscribir al curso";
      
      // Si el error es que el estudiante ya está inscrito, tratarlo como éxito
      // porque significa que el curso ya está en su lista
      if (errorMessage.toLowerCase().includes("already enrolled") || 
          errorMessage.toLowerCase().includes("ya está inscrito")) {
        toast.success("Ya estás inscrito en este curso. Redirigiendo...", {
          duration: 3000,
        });
        
        // Invalidar cache del instructor para que se actualicen los datos de estudiantes
        invalidateInstructorCache();
        
        // Disparar evento personalizado para refrescar datos del instructor
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("instructorDataRefresh"));
        }
        
        // Limpiar el carrito de todas formas
        dispatch(resetCart());
        // Redirigir a cursos inscritos
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

  const handleBuyCourse = () => {
    if (token) {
      // Normalizar courseId a array de strings
      const normalizedCourseId = Array.isArray(courseId)
        ? courseId[0]
        : courseId;
      
      if (!normalizedCourseId) {
        toast.error("ID de curso no válido");
        return;
      }

      const coursesId = [String(normalizedCourseId)];

      // ================ MODO TEMPORAL ================
      // TODO: REMOVER ESTE BLOQUE Y DESCOMENTAR buyCourse CUANDO SE IMPLEMENTE LA PASARELA DE PAGO
      // Mostrar advertencia antes de proceder
      const confirmed = window.confirm(
        "⚠️ MODO TEMPORAL\n\n" +
        "Esta compra no requiere pago real. Solo para pruebas y desarrollo.\n\n" +
        "Esto será removido cuando se implemente la pasarela de pago.\n\n" +
        "¿Deseas continuar?"
      );

      if (confirmed) {
        enrollCourseDirectly(coursesId);
      }
      return;

      // ================ CÓDIGO ORIGINAL (COMENTADO TEMPORALMENTE) ================
      // buyCourse(token, coursesId, user, router.push, dispatch);
      // return;
    }
    setConfirmationModal({
      text1: "¡No estás autenticado!",
      text2: "Por favor, inicia sesión para comprar el curso.",
      btn1Text: "Iniciar Sesión",
      btn2Text: "Cancelar",
      btn1Handler: () => router.push("/auth/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Eres un Instructor. No puedes comprar un curso.");
      return;
    }
    if (token && course) {
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

  const handleCollapseAll = () => {
    setIsActive([]);
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

// Hook para manejar el estado y lógica de RenderTotalAmount
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { buyCourse } from "@shared/services/studentFeaturesAPI";
import { RootState, AppDispatch } from "@shared/store/store";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { setPaymentLoading } from "@modules/course/store/courseSlice";
import { resetCart } from "@modules/course/store/cartSlice";
import { CartItem, BuyNowTemporaryResponse } from "@modules/course/types";

export interface UseCartTotalReturn {
  total: number;
  cart: CartItem[];
  token: string | null;
  user: unknown;
  formattedTotal: string;
  handleBuyCourse: () => Promise<void>;
}

export function useCartTotal(): UseCartTotalReturn {
  const { total, cart } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.profile);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // ================ TEMPORAL: Función para inscribir directamente sin pago ================
  // TODO: REMOVER ESTA FUNCIÓN CUANDO SE IMPLEMENTE LA PASARELA DE PAGO
  const enrollCoursesDirectly = async (coursesId: string[]) => {
    const toastId = toast.loading("Inscribiendo a los cursos...");
    dispatch(setPaymentLoading(true));

    try {
      console.log("Enviando cursos al backend:", coursesId);

      const response = await apiConnector<BuyNowTemporaryResponse>(
        "POST",
        studentEndpoints.BUY_NOW_TEMPORARY_API,
        { coursesId } as Record<string, unknown>,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("Respuesta del backend:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "No se pudieron inscribir los cursos");
      }

      // Mostrar mensaje de éxito único y conciso
      toast.success("¡Inscrito exitosamente! Redirigiendo...", {
        duration: 3000,
      });

      // Limpiar el carrito antes de redirigir
      dispatch(resetCart());

      // Disparar evento personalizado para notificar que se compraron cursos
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('coursePurchased'));
      }

      // Pequeño delay para asegurar que el backend procese la inscripción
      setTimeout(() => {
        router.push("/dashboard/enrolled-courses");
        // Forzar recarga completa después de navegar para asegurar que se carguen los nuevos cursos
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            // Recargar la página para asegurar que se muestren los nuevos cursos
            window.location.reload();
          }
        }, 2000);
      }, 800);
    } catch (error: unknown) {
      console.log("ERROR AL INSCRIBIR A LOS CURSOS (TEMPORAL)....", error);

      // No mostrar toast si es error 401 (el interceptor ya lo maneja)
      if ((error as { response?: { status?: number } })?.response?.status === 401) {
        return;
      }

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "No se pudieron inscribir los cursos";

      // Si el error es que el estudiante ya está inscrito, tratarlo como éxito
      // porque significa que el curso ya está en su lista
      if (errorMessage.toLowerCase().includes("already enrolled") ||
        errorMessage.toLowerCase().includes("ya está inscrito")) {
        toast.success("Ya estás inscrito en uno o más cursos. Redirigiendo...", {
          duration: 3000,
        });
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

  const handleBuyCourse = async () => {
    // Normalizar los IDs de los cursos (priorizar 'id' sobre '_id')
    const courses = (Array.isArray(cart) ? cart : []).map((course: CartItem) => {
      const courseId = (course as { id?: string })?.id || course?._id;
      return courseId ? String(courseId) : null;
    }).filter(Boolean) as string[];

    console.log("Cursos a comprar:", courses);
    console.log("Cart completo:", cart);

    if (courses.length === 0) {
      toast.error("No hay cursos en el carrito");
      return;
    }

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
      await enrollCoursesDirectly(courses);
    }
    return;

    // ================ CÓDIGO ORIGINAL (COMENTADO TEMPORALMENTE) ================
    // await buyCourse(token, courses, user, router.push, dispatch);
  };

  // Calcular el total sumando todos los precios del carrito (más confiable que el estado total)
  const calculatedTotal = (Array.isArray(cart) ? cart : []).reduce((sum: number, course: CartItem) => {
    const coursePrice = typeof course.price === 'number'
      ? course.price
      : (typeof course.price === 'string' ? parseFloat(course.price) : 0);
    return sum + coursePrice;
  }, 0);

  // Usar el total calculado o el del estado (el calculado tiene prioridad)
  const finalTotal = calculatedTotal > 0 ? calculatedTotal : (total || 0);

  // Formatear el total correctamente
  const formattedTotal = typeof finalTotal === 'number'
    ? finalTotal.toFixed(2)
    : (typeof finalTotal === 'string' ? parseFloat(finalTotal).toFixed(2) : '0.00');

  return {
    total,
    cart: Array.isArray(cart) ? cart : [],
    token,
    user,
    formattedTotal,
    handleBuyCourse,
  };
}



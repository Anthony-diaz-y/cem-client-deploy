"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import IconBtn from "@shared/components/IconBtn";
import { buyCourse } from "@shared/services/studentFeaturesAPI";
import { RootState, AppDispatch } from "@shared/store/store";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { setPaymentLoading } from "@modules/course/store/courseSlice";
import { resetCart } from "@modules/course/store/cartSlice";

export default function RenderTotalAmount() {
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
      
      const response = await apiConnector(
        "POST",
        studentEndpoints.BUY_NOW_TEMPORARY_API,
        { coursesId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("Respuesta del backend:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "No se pudieron inscribir los cursos");
      }

      // Mostrar mensaje de éxito con advertencia temporal
      toast.success(
        response.data.message || "¡Cursos agregados exitosamente! (Modo temporal - sin pago)",
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
    } catch (error: any) {
      console.log("ERROR AL INSCRIBIR A LOS CURSOS (TEMPORAL)....", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
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
    const courses = cart.map((course: CartItem) => {
      const courseId = (course as any)?.id || course?._id;
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
  const calculatedTotal = cart.reduce((sum: number, course: CartItem) => {
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

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {formattedTotal}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}

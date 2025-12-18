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
      const response = await apiConnector(
        "POST",
        studentEndpoints.BUY_NOW_TEMPORARY_API,
        { coursesId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

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

      router.push("/dashboard/enrolled-courses");
      dispatch(resetCart());
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
    const courses = cart.map((course) => (course as any)?.id || course._id).filter(Boolean);
    
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

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}

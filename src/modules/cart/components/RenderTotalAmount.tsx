import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-hot-toast";

import { useCartTotal } from "../hooks/useCartTotal";
import { CART_TEXTS } from "../constants/cart.constants";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { resetCart } from "@modules/course/store/cartSlice";

export default function RenderTotalAmount() {
  const { formattedTotal, courseIds } = useCartTotal();
  const [{ isPending }] = usePayPalScriptReducer();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">{CART_TEXTS.total}</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">$ {formattedTotal}</p>

      {isPending ? (
        <div className="w-full h-[45px] bg-richblack-700 animate-pulse rounded-md" />
      ) : (
        <PayPalButtons
          createOrder={(data, actions) => {
            console.log("Creando orden de PayPal...", { courseIds });
            // No pasamos headers manualmente, el apiConnector ya tiene interceptores para el token
            if (!courseIds || courseIds.length === 0) {
              console.error("No hay cursos para comprar");
              toast.error("El carrito está vacío");
              return Promise.reject("El carrito está vacío");
            }

            return apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
              coursesId: courseIds,
            })
              .then((response) => {
                console.log("Respuesta creación orden:", response.data);
                const orderId = response.data.orderId;
                if (orderId) return orderId;
                throw new Error("Order ID not found in response");
              })
              .catch((err) => {
                console.error("Error creating order:", err);

                const errorData = err.response?.data;
                const errorMessage = errorData?.message || "";

                // Manejo específico: Usuario ya inscrito (Backend validation)
                if (
                  typeof errorMessage === "string" &&
                  (errorMessage.toLowerCase().includes("already enrolled") || errorMessage.toLowerCase().includes("ya está inscrito"))
                ) {
                  toast.success("¡Ya estás inscrito en este curso! Redirigiendo...");
                  dispatch(resetCart());
                  router.push("/dashboard/enrolled-courses");
                  // Retornamos una promesa rechazada controlada para detener PayPal sin error visual
                  return Promise.reject("ALREADY_ENROLLED");
                }

                // Verificar si es error de autenticación
                if (err.response?.status === 401) {
                  toast.error("Sesión expirada. Por favor inicie sesión nuevamente.");
                } else {
                  toast.error(errorMessage || "No se pudo iniciar el pago");
                }
                throw err;
              });
          }}
          onApprove={(data, actions) => {
            return apiConnector("POST", studentEndpoints.CAPTURE_PAYPAL_ORDER_API, {
              orderId: data.orderID
            })
              .then((response) => {
                toast.success("Payment Successful!");
                dispatch(resetCart());
                router.push("/dashboard/enrolled-courses");
              })
              .catch((err) => {
                console.error("Error capturing order:", err);
                toast.error("Payment failed");
                throw err;
              });
          }}
          style={{ layout: "vertical" }}
        />
      )}
    </div>
  );
}

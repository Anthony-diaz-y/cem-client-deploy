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
        <div className="relative w-full h-[48px] rounded-lg overflow-hidden bg-[#008396] group">
          {/* Capa Visual */}
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none group-hover:bg-[#007485] transition-all">
            Comprar ahora
          </div>

          {/* Capa Funcional (PayPal Invisible) */}
          <div className="absolute inset-x-0 inset-y-0 z-20 opacity-[0.01] scale-[1.5] cursor-pointer">
            <PayPalButtons
              forceReRender={[courseIds, formattedTotal]}
              style={{
                layout: "horizontal",
                height: 48,
                tagline: false
              }}
              createOrder={(data, actions) => {
                console.log("Creando orden de PayPal...", { courseIds });
                if (!courseIds || courseIds.length === 0) {
                  console.error("No hay cursos para comprar");
                  toast.error("El carrito está vacío");
                  return Promise.reject("El carrito está vacío");
                }

                return apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
                  coursesId: courseIds,
                })
                  .then((response) => {
                    const orderId = response.data.orderId;
                    if (orderId) return orderId;
                    throw new Error("Order ID not found in response");
                  })
                  .catch((err) => {
                    const errorMessage = err.response?.data?.message || "";
                    if (
                      errorMessage.toLowerCase().includes("already enrolled") ||
                      errorMessage.toLowerCase().includes("ya está inscrito")
                    ) {
                      toast.success("¡Ya estás inscrito! Redirigiendo...");
                      dispatch(resetCart());
                      router.push("/dashboard/enrolled-courses");
                      return Promise.reject("ALREADY_ENROLLED");
                    }
                    toast.error(errorMessage || "No se pudo iniciar el pago");
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
                    toast.error("Payment failed");
                    throw err;
                  });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

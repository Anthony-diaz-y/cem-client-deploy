import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-hot-toast";

import { useCartTotal } from "../hooks/useCartTotal";
import { CART_TEXTS } from "../constants/cart.constants";
import { apiConnector } from "@shared/services/apiConnector";
import { studentEndpoints } from "@shared/services/apis";
import { resetCart } from "@modules/course/store/cartSlice";
import PaymentModal from "@modules/course/components/details/PaymentModal";

export default function RenderTotalAmount() {
  const { formattedTotal, courseIds, total } = useCartTotal();
  const [{ isPending }] = usePayPalScriptReducer();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const createPayPalOrder = async () => {
    console.log("Creando orden de PayPal para carrito...", { courseIds });
    if (!courseIds || courseIds.length === 0) {
      toast.error("El carrito está vacío");
      return Promise.reject("El carrito está vacío");
    }

    try {
      const response = await apiConnector<{ orderId: string }>("POST", studentEndpoints.CREATE_PAYPAL_ORDER_API, {
        coursesId: courseIds,
      });
      const orderId = response.data.orderId;
      if (orderId) return orderId;
      throw new Error("Order ID not found in response");
    } catch (err: any) {
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
    }
  };

  const onPayPalApprove = async (data: any) => {
    try {
      await apiConnector("POST", studentEndpoints.CAPTURE_PAYPAL_ORDER_API, {
        orderId: data.orderID
      });
      toast.success("¡Compra exitosa!");
      dispatch(resetCart());
      router.push("/dashboard/enrolled-courses");
    } catch (err) {
      toast.error("Error al procesar el pago");
      throw err;
    }
  };

  return (
    <div className="min-w-[280px] rounded-xl border border-cem-neutral-gray-100 bg-cem-cardbackground p-6 shadow-sm self-start">
      <p className="mb-1 text-sm font-medium text-cem-neutral-gray-500 tracking-wide">
        {CART_TEXTS.total}
      </p>
      <div className="flex items-baseline gap-2 mb-6">
        <p className="text-3xl font-bold text-cem-primary">
          S/ {formattedTotal}
        </p>
        <span className="text-xs font-medium text-cem-neutral-gray-400">PEN</span>
      </div>

      <button
        onClick={() => setShowPaymentModal(true)}
        className="w-full h-[48px] rounded-lg bg-cem-primary text-white font-bold flex items-center justify-center hover:bg-cem-primary-dark transition-all shadow-md active:scale-[0.98]"
      >
        Comprar ahora
      </button>

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          createPayPalOrder={createPayPalOrder}
          onPayPalApprove={onPayPalApprove}
          price={total}
          priceUSD={total / 3.75}
        />
      )}
    </div>
  );
}

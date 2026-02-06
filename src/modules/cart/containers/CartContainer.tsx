import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import RenderCartCourses from "../components/RenderCartCourses";
import RenderTotalAmount from "../components/RenderTotalAmount";
import { useCart } from "../hooks/useCart";
import { CART_TEXTS } from "../constants/cart.constants";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
  currency: "USD",
  intent: "capture",
};

export default function CartContainer() {
  const { totalItems, hasCourses } = useCart();

  return (
    <PayPalScriptProvider options={initialOptions}>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
        {CART_TEXTS.title}
      </h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {CART_TEXTS.coursesInCart(totalItems)}
      </p>
      {hasCourses ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100">
          {CART_TEXTS.emptyCart}
        </p>
      )}
    </PayPalScriptProvider>
  );
}



"use client";

import { IconBtn } from "@shared/components";
import { useCartTotal } from "../hooks/useCartTotal";
import { CART_TEXTS } from "../constants/cart.constants";

export default function RenderTotalAmount() {
  const { formattedTotal, handleBuyCourse } = useCartTotal();

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">{CART_TEXTS.total}</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">$ {formattedTotal}</p>
      <IconBtn
        text={CART_TEXTS.buyNow}
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}

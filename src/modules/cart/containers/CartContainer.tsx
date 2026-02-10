import React from "react";
import RenderCartCourses from "../components/RenderCartCourses";
import RenderTotalAmount from "../components/RenderTotalAmount";
import { useCart } from "../hooks/useCart";
import { CART_TEXTS } from "../constants/cart.constants";

export default function CartContainer() {
  const { totalItems, hasCourses } = useCart();
  return (
    <>
      <h1 className="mb-14 text-3xl font-bold text-cem-neutral-gray-900 font-boogaloo text-center sm:text-left">
        {CART_TEXTS.title}
      </h1>
      <p className="border-b border-b-cem-neutral-gray-100 pb-2 font-semibold text-cem-neutral-gray-500">
        {CART_TEXTS.coursesInCart(totalItems)}
      </p>

      {hasCourses ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-cem-neutral-gray-400">
          {CART_TEXTS.emptyCart}
        </p>
      )}
    </>
  );
}



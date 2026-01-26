"use client";

import { useState } from "react";
import Cart from "@modules/cart/containers/CartContainer";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

export default function CartPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-richblack-400">Cargando...</p>
      </div>
    );
  }

  if (user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return null;
  }

  return <Cart />;
}

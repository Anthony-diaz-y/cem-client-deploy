"use client";

import { useState } from "react";
import Cart from "@modules/cart/components/Cart";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

export default function CartPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted || user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return null;
  }

  return <Cart />;
}

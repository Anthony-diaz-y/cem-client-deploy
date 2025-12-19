"use client";

import { useState, useEffect } from "react";
import Cart from "@modules/cart/components/Cart";
import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";

export default function CartPage() {
  const { user } = useAppSelector((state) => state.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Todos los hooks deben ejecutarse antes de cualquier return condicional
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

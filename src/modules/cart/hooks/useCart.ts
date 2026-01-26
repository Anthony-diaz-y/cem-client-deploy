// Hook para manejar el estado y lógica de Cart
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";

export interface UseCartReturn {
  total: number;
  totalItems: number;
  cart: unknown[];
  hasCourses: boolean;
}

export function useCart(): UseCartReturn {
  const { total, totalItems, cart } = useSelector((state: RootState) => state.cart);

  // Verificar si hay cursos en el carrito basándose en el array cart, no solo en total
  const hasCourses = cart && Array.isArray(cart) && cart.length > 0;

  return {
    total,
    totalItems,
    cart: Array.isArray(cart) ? cart : [],
    hasCourses,
  };
}



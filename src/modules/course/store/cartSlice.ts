import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { getLocalStorage } from "@shared/utils/localStorage";
import { CartItem, CartState } from "../types";

const getInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const cart = getLocalStorage("cart");
  return cart ? JSON.parse(cart) : [];
};

const getInitialTotal = (): number => {
  if (typeof window === "undefined") {
    return 0;
  }
  const total = getLocalStorage("total");
  return total ? JSON.parse(total) : 0;
};

const getInitialTotalItems = (): number => {
  if (typeof window === "undefined") {
    return 0;
  }
  const totalItems = getLocalStorage("totalItems");
  return totalItems ? JSON.parse(totalItems) : 0;
};

const initialState: CartState = {
  cart: getInitialCart(),
  total: getInitialTotal(),
  totalItems: getInitialTotalItems(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const course = action.payload;
      const courseId = (course as any)?.id || course._id;
      const index = state.cart.findIndex((item) => {
        const itemId = (item as any)?.id || item._id;
        return itemId === courseId;
      });

      if (index >= 0) {
        // If the course is already in the cart, do not modify the quantity
        toast.error("El curso ya está en el carrito");
        return;
      }
      // If the course is not in the cart, add it to the cart
      state.cart.push(course);
      // Update the total quantity and price
      state.totalItems++;
      // Asegurar que el precio sea un número válido
      const coursePrice = typeof course.price === 'number' 
        ? course.price 
        : parseFloat(course.price?.toString() || '0') || 0;
      state.total = (state.total || 0) + coursePrice;
      // Update to localstorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      }
      // show toast
      toast.success("Curso agregado al carrito");
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => {
        const itemId = (item as any)?.id || item._id;
        return itemId === courseId;
      });

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.totalItems--;
        // Asegurar que el precio sea un número válido
        const coursePrice = typeof state.cart[index].price === 'number'
          ? state.cart[index].price
          : parseFloat(state.cart[index].price?.toString() || '0') || 0;
        state.total = Math.max(0, (state.total || 0) - coursePrice);
        state.cart.splice(index, 1);
        // Update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        // show toast
        toast.success("Curso eliminado del carrito");
      }
    },

    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      // Update to localstorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        localStorage.removeItem("total");
        localStorage.removeItem("totalItems");
      }
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;

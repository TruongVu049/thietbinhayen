"use client";

import type { ChiTietGioHang, SanPham } from "@/lib/db/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { User } from "next-auth";

export type UpdateType = "delete" | "plus" | "minus";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: {
        merchandiseId: number;
        updateType: UpdateType;
        isLocal: boolean;
      };
    }
  | {
      type: "ADD_ITEM";
      payload: { product: SanPham; quantity: number; isLocal: boolean };
    };

type CartContextType = {
  cart: ChiTietGioHang[] | undefined;
  user?: User;
  count: number;
  updateCartItem: (merchandiseId: number, updateType: UpdateType) => void;
  addCartItem: (product: SanPham, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function updateCartItem(item: ChiTietGioHang, updateType: UpdateType) {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.soluong + 1 : item.soluong - 1;
  if (newQuantity === 0) return null;

  return {
    ...item,
    soluong: newQuantity,
  };
}

function createOrUpdateCartItem(
  existingItem: ChiTietGioHang | undefined,
  product: SanPham,
  quantity: number,
  isLocal: boolean
): ChiTietGioHang {
  return {
    id: existingItem?.id ?? product?.id,
    soluong: existingItem
      ? quantity <= product.soluong
        ? quantity
        : existingItem.soluong
      : quantity,
    ten: product.ten,
    hinhanh: product.hinhanh,
    gia: product.gia,
    isLocal: isLocal,
    ngaytao: new Date(),
  };
}

function cartReducer(
  state: ChiTietGioHang[] | undefined,
  action: CartAction
): ChiTietGioHang[] {
  const currentCart = state || [];
  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart
        .map((item) =>
          item.id === merchandiseId ? updateCartItem(item, updateType) : item
        )
        .filter(Boolean) as ChiTietGioHang[];
      if (updateType == "delete") {
        let cartLocal = JSON.parse(localStorage?.getItem("cart") ?? "[]");

        if (cartLocal.length) {
          cartLocal = cartLocal.filter(
            (item: ChiTietGioHang) => item.id !== merchandiseId
          );
          localStorage.setItem("cart", JSON.stringify(cartLocal));
        }
      }

      if (updatedLines.length === 0) {
        return [];
      }

      return updatedLines;
    }
    case "ADD_ITEM": {
      const { product, quantity, isLocal } = action.payload;
      const existingItem = currentCart.find((item) => item.id === product.id);
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        product,
        quantity,
        isLocal
      );
      const updatedLines = existingItem
        ? currentCart.map((item) =>
            item.id === product.id ? updatedItem : item
          )
        : [updatedItem, ...currentCart];
      return updatedLines;
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  user,
  cartP,
}: {
  children: React.ReactNode;
  user?: User;
  cartP: ChiTietGioHang[];
}) {
  const [count, setCount] = useState<number>(0);
  const initialCart = (cartP: ChiTietGioHang[] = []) => {
    if (typeof window !== "undefined") {
      const product = JSON.parse(localStorage?.getItem("cart") ?? "[]");

      if (!cartP.length && !product.length) {
        return [];
      }

      const newItems: ChiTietGioHang[] = [];

      product.forEach((item: ChiTietGioHang) => {
        const existingItem = cartP.find((pd) => pd.id === item.id);

        if (!existingItem) {
          newItems.push(item);
        }
      });

      return [...cartP, ...newItems];
    }
    return cartP;
  };
  const [cart, dispatch] = useReducer(cartReducer, cartP, initialCart);

  useEffect(() => {
    if (!user) {
      console.log("update localstorage");
      localStorage.setItem("cart", JSON.stringify(cart)); // Cập nhật localStorage khi cart thay đổi
    }
  }, [cart]);

  const updateCartItem = (merchandiseId: number, updateType: UpdateType) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType, isLocal: !user ? true : false },
    });
  };

  const addCartItem = (product: SanPham, quantity: number) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity, isLocal: !user ? true : false },
    });
    setCount(count + 1);
  };

  return (
    <CartContext.Provider
      value={{ cart: cart, user, count, updateCartItem, addCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

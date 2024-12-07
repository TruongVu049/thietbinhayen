"use client";
import { SanPham } from "@/lib/db/types";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { addItem } from "@/components/cart/actions";
import { useCart } from "./cart-context";
import Link from "next/link";
import { SubmitButton } from "../submitButton";
export type Message = {
  message: string;
  sending: boolean | null;
};

export function AddToCart({ product }: { product: SanPham }) {
  const [quantity, setQuantity] = useState<number>(product.soluong ? 1 : 0);

  const { addCartItem, user } = useCart();

  function handleChangequantity(type: "increase" | "decrease") {
    if (type === "increase") {
      quantity + 1 <= product.soluong && setQuantity(quantity + 1);
    } else {
      quantity - 1 > 0 && setQuantity(quantity - 1);
    }
  }

  const payload = {
    productId: product.id,
    quantity: quantity,
    userId: Number(user?.id),
  };

  const actionWithVariant = addItem.bind(null, payload);

  return (
    <>
      <form
        action={async () => {
          quantity && addCartItem(product, quantity);
          user && actionWithVariant();
        }}
      >
        <div className="flex items-center flex-row  gap-3 mb-2">
          <div className="w-1/2 flex items-center justify-center border border-gray-400 rounded-full">
            <button
              type="button"
              onClick={() => handleChangequantity("decrease")}
              className="group py-[14px] px-3 w-full border-r border-gray-400 rounded-l-full h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300"
            >
              <Minus className="stroke-black group-hover:text-blue-500 w-5 h-5" />
            </button>
            <input
              type="number"
              name="soluong"
              className="cursor-pointer ml-2 font-semibold text-gray-900 text-lg py-1 px-1 md:w-full w-10  h-full bg-transparent placeholder:text-gray-900 text-center hover:text-indigo-600 outline-0 hover:placeholder:text-indigo-600"
              value={quantity}
              min={1}
              max={product.soluong}
              readOnly
            />
            <button
              type="button"
              onClick={() => handleChangequantity("increase")}
              className="group py-[14px] px-3 w-full border-l border-gray-400 rounded-r-full h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300"
            >
              <Plus className="stroke-black group-hover:text-blue-500 w-5 h-5" />
            </button>
          </div>
          <SubmitButton
            label={"Giỏ hàng"}
            cName={`${
              product.soluong ? "" : "pointer-events-none"
            }  w-1/2 group py-3 md:px-5 px-2 h-full rounded-full text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-indigo-300`}
            bgColor="bg-indigo-100"
            bgColorHover="bg-indigo-200"
          >
            <ShoppingCart className="w-5 h-5 stroke-indigo-600 transition-all duration-500 group-hover:stroke-indigo-600" />
          </SubmitButton>
        </div>
        <span className="inline-block  min-[400px]:mb-4 md:text-base text-sm text-gray-700">
          {product.soluong} sản phẩm hiện có
        </span>
        {/* <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p> */}
      </form>
      <Link
        aria-disabled={!quantity}
        href={{
          pathname: "/checkout",
          query: {
            search: JSON.stringify([
              {
                id: product.id,
                soluong: quantity,
                ten: product.ten,
                hinhanh: product.hinhanh,
                gia: product.gia,
              },
            ]),
          },
        }}
        className={`${
          !product.soluong
            ? "pointer-events-none bg-indigo-300"
            : "bg-indigo-600"
        }  text-centew-full px-5 py-4 rounded-[100px]  flex items-center justify-center font-semibold text-lg text-white shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-300`}
      >
        {product.soluong ? "Mua ngay" : "Hết hàng"}
      </Link>
    </>
  );
}

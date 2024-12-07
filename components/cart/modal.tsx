"use client";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { FormatVND } from "@/helpers/utils";

import { useEffect, useState } from "react";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { ChiTietGioHang } from "@/lib/db/types";
import ImageKit from "../imagekit";
import { usePathname } from "next/navigation";

export default function CartModal() {
  const { cart, updateCartItem, user, count } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

  useEffect(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [count]);

  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild title="Giỏ hàng">
        <Button variant="outline" size="icon" className="shrink-0 relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute top-[-10px] right-[-10px] bg-rose-500 flex items-center justify-center text-white rounded-full w-6 h-6 ">
            <strong className="text-sm">{cart?.length}</strong>
          </span>
          <span className="sr-only">Toggle navigation ShoppingCart</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        side="right"
        className="bg-white md:p-5 p-2.5 sm:max-w-xl sm:w-[40%]  w-[80%]"
      >
        <SheetTitle>Giỏ hàng</SheetTitle>
        <div className="my-3 h-full flex flex-col justify-between ">
          <div
            className="overflow-y-auto [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            <div className="grid border-b border-gray-200 py-3 gap-3 ">
              {!cart || cart.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCart className="h-16" />
                  <p className="text-gray-500 mt-6 text-center text-2xl font-bold">
                    Chưa có sản phẩm trong giỏ hàng
                  </p>
                </div>
              ) : (
                <ul className="grid border-t border-gray-200 py-3 gap-3 ">
                  {/* <DeleteItemButton item={item} optimisticUpdate={updateCartItem} /> */}
                  {cart.map((item: ChiTietGioHang) => {
                    return (
                      <li
                        key={item.id}
                        className="flex items-center flex-row md:gap-3 gap-1 w-full"
                      >
                        <div className="relative h-16 w-16 rounded-lg">
                          <ImageKit
                            path={item.hinhanh}
                            alt="image"
                            loading="lazy"
                            height={300}
                            width={400}
                            className="md:h-full h-auto w-full object-cover rounded-xl"
                          />
                        </div>
                        <div className="w-full flex justify-between items-center">
                          <div>
                            <h5 className="md:text-lg text-base md:leading-6 line-clamp-1 leading-4  text-black">
                              {item.ten}
                            </h5>
                            <p className="font-normal md:text-base text-sm md:leading-6 leading-4  text-gray-500">
                              x {item.soluong}
                            </p>
                            <h6 className="font-bold md:text-lg text-base md:leading-6 leading-4 text-rose-500">
                              {FormatVND({ amount: item.gia })}
                            </h6>
                          </div>
                          <div>
                            <DeleteItemButton
                              item={item}
                              userId={Number(user?.id)}
                              reducerUpdate={updateCartItem}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div>
            <Link
              href={"/gio-hang"}
              className=" block text-center md:text-lg mb-3 text-base w-full py-4 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700"
            >
              Giỏ hàng
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

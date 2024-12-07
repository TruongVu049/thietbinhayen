"use client";
import { useCart } from "@/components/cart/cart-context";
import { DeleteItemButton } from "@/components/cart/delete-item-button";
import { EditItemQuantityButton } from "@/components/cart/edit-item-quantity-button";
import ImageKit from "@/components/imagekit";
import { FormatVND } from "@/helpers/utils";
import { ChiTietGioHang } from "@/lib/db/types";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FormShoppingCart() {
  const { cart, updateCartItem, user } = useCart();
  const [selectedCartItem, setSelectedCartItem] = useState<
    (ChiTietGioHang | null)[]
  >([]);

  useEffect(() => {
    if (selectedCartItem.length) {
      const newCartItem = selectedCartItem
        .map((item: ChiTietGioHang | null) => {
          const existingItem = cart?.find((c) => c.id === item?.id);
          if (existingItem) return existingItem;
          return null;
        })
        .filter((item) => item);
      newCartItem && setSelectedCartItem(newCartItem);
    }
  }, [cart]);

  return (
    <div className="max-w-screen-xl block mx-auto">
      <div className="md:h-[900px] h-[600px] container-shoppingcart w-full bg-white md:p-10 p-4  lg:border-r border-gray-200   shadow-xl">
        <div className="flex justify-between border-b pb-8">
          <h1 className="font-semibold text-2xl">Giỏ hàng</h1>
        </div>
        <div className="flex mt-10 mb-5">
          <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
            Sản phẩm
          </h3>
          <h3 className="font-semibold  text-gray-600 text-xs uppercase w-1/5 ">
            Số lượng
          </h3>
          <h3 className="font-semibold  text-gray-600 text-xs uppercase w-1/5 ">
            Giá
          </h3>
          <h3 className="font-semibold  text-gray-600 text-xs uppercase w-1/5 ">
            Tổng
          </h3>
          <h3 className="font-semibold  text-gray-600 text-xs uppercase  " />
        </div>
        <div className="container-content">
          {cart
            ? cart?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
                >
                  <div className="flex w-2/5 md:flex-row items-center flex-col">
                    <div className="flex items-center gap-2 ">
                      <input
                        id={`input-${item.id}`}
                        defaultValue={item.id}
                        onChange={() => {
                          const cartItem = selectedCartItem.find(
                            (c) => c?.id === item.id
                          );
                          if (cartItem) {
                            setSelectedCartItem(
                              selectedCartItem.filter(
                                (c) => c?.id !== cartItem.id
                              )
                            );
                          } else {
                            const newItem = cart.find((c) => c.id === item.id);
                            newItem &&
                              setSelectedCartItem([
                                ...selectedCartItem,
                                newItem,
                              ]);
                          }
                        }}
                        type="checkbox"
                        className="accent-rose-500 w-6 h-6  bg-gray-100 border-gray-300 rounded"
                      />
                      <div className="relative md:h-24 md:w-24 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <ImageKit
                          path={item.hinhanh}
                          alt={item.hinhanh}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between ml-4 flex-grow">
                      <span className="font-medium md:text-sm text-xs line-clamp-2 hover:text-[#00c16a]">
                        {item.ten}
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-center max-w-[8rem]">
                    <EditItemQuantityButton
                      item={item}
                      type="minus"
                      userId={Number(user?.id)}
                      reducerUpdate={updateCartItem}
                    />
                    <input
                      type="text"
                      value={item.soluong}
                      readOnly
                      className="cursor-pointer  bg-gray-50 border border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 "
                    />
                    <EditItemQuantityButton
                      item={item}
                      type="plus"
                      userId={Number(user?.id)}
                      reducerUpdate={updateCartItem}
                    />
                  </div>
                  <span className="text-center w-1/5 font-semibold text-rose-500 text-sm">
                    {FormatVND({ amount: item.gia })}
                  </span>
                  <span className="text-center w-1/5 font-semibold text-rose-500 text-sm">
                    {FormatVND({ amount: item.gia * item.soluong })}
                  </span>
                  <DeleteItemButton
                    item={item}
                    userId={Number(user?.id)}
                    reducerUpdate={updateCartItem}
                  />
                </div>
              ))
            : null}
        </div>
        <div className="loader hidden">
          <div className="flex items-center justify-between hover:bg-gray-100 -mx-8 px-6 py-5">
            <div className="flex w-[60%]">
              <div className="ml-8 h-24 w-24 bg-gray-300 rounded-md" />
              <div className="flex flex-col justify-between ml-4 flex-grow">
                <div className="h-2.5 bg-gray-300 rounded-full  w-[70%] mb-2.5" />
                <div className="h-2.5 bg-gray-300 rounded-full  w-[80%] mb-2.5" />
                <div className="h-2.5 bg-gray-300 rounded-full  w-[90%] mb-2.5" />
              </div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-32 mb-2.5" />
          </div>
          <div className="flex items-center justify-between hover:bg-gray-100 -mx-8 px-6 py-5">
            <div className="flex w-[60%]">
              <div className="ml-8 h-24 w-24 bg-gray-300 rounded-md" />
              <div className="flex flex-col justify-between ml-4 flex-grow">
                <div className="h-2.5 bg-gray-300 rounded-full  w-[70%] mb-2.5" />
                <div className="h-2.5 bg-gray-300 rounded-full  w-[80%] mb-2.5" />
                <div className="h-2.5 bg-gray-300 rounded-full  w-[90%] mb-2.5" />
              </div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-32 mb-2.5" />
          </div>
          <div className="flex items-center justify-between hover:bg-gray-100 -mx-8 px-6 py-5">
            <div className="flex w-[60%]">
              <div className="ml-8 h-24 w-24 bg-gray-300 rounded-md" />
              <div className="flex flex-col justify-between ml-4 flex-grow">
                <div className="h-2.5 bg-gray-300 rounded-full  w-[70%] mb-2.5" />
                <div className="h-2.5 bg-gray-300 rounded-full  w-[80%] mb-2.5" />
                <div className="h-2.5 bg-gray-300 rounded-full  w-[90%] mb-2.5" />
              </div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-32 mb-2.5"></div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0  bg-white z-[10] shadow-lg">
        <h1 className="font-semibold text-2xl border-b pb-8 bg-gray-300" />
        <div className="w-full lg:px-6 sm:px-4 px-3 lg:py-8 sm:py-4 py-2">
          <div className="flex justify-between mb-3 ">
            <span className="quantity font-semibold text-sm uppercase" />
          </div>
          <div className="border-t mt-3">
            <div className="flex font-semibold justify-between py-3 ms:text-sm sm:text-base uppercase">
              <span>Tổng Tiền</span>
              <span className="sum normal-case lg:text-xl md:text-lg sm:text-md text-base text-rose-500">
                {FormatVND({
                  amount:
                    selectedCartItem.reduce(
                      (sum, item) => sum + (item ? item.soluong * item.gia : 0),
                      0
                    ) ?? 0,
                })}
              </span>
            </div>
            <Link
              aria-disabled={!selectedCartItem.length}
              href={{
                pathname: "/checkout",
                query: {
                  search: JSON.stringify(selectedCartItem),
                },
              }}
              className={`${
                !selectedCartItem.length ? "pointer-events-none" : ""
              } block text-center bg-gray-800 font-bold cursor-pointer  hover:bg-gray-700 py-3 sm:text-sm text-white uppercase w-full`}
            >
              Thanh Toán{" "}
            </Link>
          </div>
          <span className="err-shoppingcart md:text-base text-sm text-rose-500 mt-2 hidden" />
        </div>
      </div>
    </div>
  );
}

// infinite loading https://github.dev/rajeshdavidbabu/infinite-scroll-server-actions/tree/master/src/libs

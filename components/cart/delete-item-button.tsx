"use client";

import { Trash } from "lucide-react";
import { removeItem } from "@/components/cart/actions";
import type { ChiTietGioHang } from "@/lib/db/types";
import { UpdateType } from "./cart-context";
export function DeleteItemButton({
  item,
  userId,
  reducerUpdate,
}: {
  item: ChiTietGioHang;
  userId: number | undefined;
  reducerUpdate: (merchandiseId: number, updateType: UpdateType) => void;
}) {
  const payload = {
    productId: item.id,
    userId: userId,
  };
  const actionWithVariant = removeItem.bind(null, payload);

  return (
    <form
      action={async () => {
        reducerUpdate(Number(item.id), "delete");
        userId && (await actionWithVariant());
      }}
    >
      <button type="submit" className="group ">
        <Trash className="h-6 w-6 group-hover:text-rose-500 text-gray-800" />
      </button>
    </form>
  );
}

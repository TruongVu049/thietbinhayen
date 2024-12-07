"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { updateItemQuantity } from "./actions";
import { ChiTietGioHang } from "@/lib/db/types";
import { UpdateType } from "./cart-context";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <button
      type="submit"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={`${
        type === "minus" ? "rounded-l-lg" : "rounded-r-lg"
      } bg-gray-100 hover:bg-gray-200 border border-gray-300  p-3 h-11  focus:ring-gray-100  focus:ring-2 focus:outline-none`}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  userId,
  reducerUpdate,
}: {
  item: ChiTietGioHang;
  type: "plus" | "minus";
  userId: number;
  reducerUpdate: (merchandiseId: number, updateType: UpdateType) => void;
}) {
  const payload = {
    userId: userId,
    productId: item.id,
    quantity: type === "plus" ? item.soluong + 1 : item.soluong - 1,
  };
  const actionWithVariant = updateItemQuantity.bind(null, payload);

  return (
    <form
      action={async () => {
        const res = await actionWithVariant();
        res && reducerUpdate(Number(payload.productId), type);
      }}
    >
      <SubmitButton type={type} />
    </form>
  );
}

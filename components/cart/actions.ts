"use server";

import { TAGS } from "@/lib/constants";
import { addToCart, removeFromCart, updateCart } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function addItem(payload: {
  productId?: number;
  quantity?: number;
  userId?: number;
}) {
  const { productId, quantity, userId } = payload;
  if (!userId || !productId || !quantity) {
    return "Đã có lỗi xảy ra";
  }

  try {
    const res = await addToCart({ userId, productId, quantity });
    console.log(res);
    revalidateTag(TAGS.giohang);
  } catch (e) {
    return "Đã có lỗi xảy ra";
  }
}

export async function removeItem(payload: {
  productId?: number;
  userId?: number;
}) {
  if (!payload.productId || !payload.userId) {
    return "Thiếu productId và userId";
  }

  try {
    await removeFromCart(payload.userId, payload.productId);
    revalidateTag(TAGS.giohang);
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(payload: {
  userId: number;
  productId: number | undefined;
  quantity: number;
}) {
  if (!payload.productId) {
    return "Thiếu productId";
  }

  const { productId, quantity, userId } = payload;

  try {
    let res = null;
    if (quantity === 0) {
      res = await removeFromCart(userId, productId);
    } else {
      res = await updateCart(userId, productId, quantity);
    }
    revalidateTag(TAGS.giohang);
    return res.status === 200 ? true : false;
  } catch (e) {
    console.error(e);
    return "Đã có lỗi xảy ra. Vui lòng thực hiện lại!";
  }
}

"use client";

import BackButton from "@/components/BackButton";
import { SubmitButton } from "@/components/submitButton";
import { useToast } from "@/hooks/use-toast";
import { acceptExchange, completeExchange, refusedExchange } from "@/lib/db";
import { ChiTietDoiTra } from "@/lib/db/types";
import { ToastAction } from "@radix-ui/react-toast";
import { ChevronLeft } from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FormActionReturnOrder({
  returnOrder,
  user,
}: {
  returnOrder: ChiTietDoiTra;
  user: User;
}) {
  const router = useRouter();
  const [err, serErr] = useState("");
  const actionRefused = refusedExchange.bind(null);
  const actionAccept = acceptExchange.bind(null);
  const actionComplete = completeExchange.bind(null);

  const { toast } = useToast();
  return (
    <form
      id="form-cancel-order"
      action={async (formData: FormData) => {
        let res = null;
        if (formData.has("btnRefused")) {
          if (returnOrder.doiTraDTO?.hoadon_id && user.id) {
            res = await actionRefused({
              payload: {
                exchangeOrderId: returnOrder.doitra_id,
                orderId: returnOrder.doiTraDTO?.hoadon_id,
                empId: Number(user.id),
                productId: returnOrder.sanpham_id,
              },
            });
          }
        } else if (formData.has("btnAccept")) {
          if (returnOrder.doiTraDTO?.hoadon_id && user.id) {
            console.log({
              payload: {
                exchangeOrderId: returnOrder.doitra_id,
                orderId: returnOrder.doiTraDTO?.hoadon_id,
                empId: Number(user.id),
                productId: returnOrder.sanpham_id,
              },
            });
            res = await actionAccept({
              payload: {
                exchangeOrderId: returnOrder.doitra_id,
                orderId: returnOrder.doiTraDTO?.hoadon_id,
                empId: Number(user.id),
                productId: returnOrder.sanpham_id,
              },
            });
          }
        } else if (formData.has("btnComplete")) {
          if (returnOrder.doiTraDTO?.hoadon_id && user.id) {
            res = await actionComplete({
              payload: {
                exchangeOrderId: returnOrder.doitra_id,
                orderId: returnOrder.doiTraDTO?.hoadon_id,
                empId: Number(user.id),
                productId: returnOrder.sanpham_id,
              },
            });
          }
        }
        if (res) {
          if (res.status === 200) {
            toast({
              title: `Thông báo`,
              description: `Cập nhật đơn hàng thành công`,
              action: (
                <ToastAction className="border-none" altText="Try again">
                  <div className="flex gap-2 items-center">
                    <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                      OK
                    </button>
                  </div>
                </ToastAction>
              ),
              className: "bg-white border-green-500",
            });
            serErr("");
            router.refresh();
          } else {
            toast({
              title: `Thông báo`,
              description: `Cập nhật đơn hàng không thành công.`,
              action: (
                <ToastAction className="border-none" altText="Try again">
                  <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                    Thử lại
                  </button>
                </ToastAction>
              ),
              className: "bg-white border-rose-500",
            });
            serErr(res.body);
          }
        } else {
        }
      }}
      className={`grid items-start gap-4 `}
    >
      <div className="flex items-center gap-2 justify-between">
        {returnOrder.doiTraDTO?.hoaDonDTO &&
        returnOrder.doiTraDTO?.hoaDonDTO.nhatKyDonHangs &&
        returnOrder.doiTraDTO?.hoaDonDTO?.nhatKyDonHangs[0]
          .trangthaidonhang_id == 10 ? (
          <>
            <SubmitButton
              cName="text-white"
              bgColor="bg-rose-500"
              bgColorHover="bg-rose-400"
              label={"Từ chối đổi trả"}
              name="btnRefused"
            />
            <SubmitButton
              cName="text-white"
              label={"Chấp nhận đổi trả"}
              name="btnAccept"
            />
          </>
        ) : returnOrder.doiTraDTO?.hoaDonDTO &&
          returnOrder.doiTraDTO?.hoaDonDTO.nhatKyDonHangs &&
          returnOrder.doiTraDTO?.hoaDonDTO?.nhatKyDonHangs[0]
            .trangthaidonhang_id == 12 ? (
          <>
            <SubmitButton
              cName="text-white"
              label={"Đổi trả thành công"}
              name="btnComplete"
            />
          </>
        ) : (
          <BackButton
            type="button"
            className="md:text-lg bg-transparent text-gray-700 hover:bg-transparent textbase flex gap-1 items-center"
          >
            <ChevronLeft className="w-5 h-5" />
            Trở lại
          </BackButton>
        )}
      </div>
      <span className="text-rose-500 md:text-base text-sm py-2">{err}</span>
    </form>
  );
}

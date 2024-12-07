"use client";

import { SubmitButton } from "@/components/submitButton";
import { useToast } from "@/hooks/use-toast";
import { cancelOrder, confirmOrder, CreateDeliveryOrder } from "@/lib/db";
import { NhanVien, NhatKyDonHang } from "@/lib/db/types";
import { ToastAction } from "@radix-ui/react-toast";
import { User } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FormActionOrder({
  orderLogs,
  employeeList,
  user,
}: {
  orderLogs: NhatKyDonHang | null;
  employeeList: NhanVien[];
  user: User;
}) {
  const [selectedValue, setSeletedValue] = useState<NhanVien | null>(null);
  const router = useRouter();
  async function handleChangeSelected(e: React.FormEvent<HTMLSelectElement>) {
    if (e.currentTarget.value === "") {
      setSeletedValue(null);
    } else {
      const newEmp = employeeList.find(
        (item) => item.id === Number(e.currentTarget.value)
      );
      setSeletedValue(newEmp ?? null);
    }
  }
  const actionCancel = cancelOrder.bind(null);
  const actionConfirm = confirmOrder.bind(null);
  const actionDelivery = CreateDeliveryOrder.bind(null);
  const { toast } = useToast();
  return (
    <form
      id="form-cancel-order"
      action={async (formData: FormData) => {
        // "btnCancel" | "btnConfirm" | "btnDelivery";
        let res = null;
        if (formData.has("btnCancel")) {
          if (orderLogs?.hoadon_id)
            res = await actionCancel(orderLogs?.hoadon_id);
        } else if (formData.has("btnConfirm")) {
          if (orderLogs?.hoadon_id)
            res = await actionConfirm(orderLogs?.hoadon_id, Number(user.id));
        } else if (formData.has("btnDelivery")) {
          if (!selectedValue) {
            toast({
              title: `Thông báo`,
              description: `Vui lòng chọn nhân viên giao hàng trước khi chọn vận chuyển.`,
              action: (
                <ToastAction className="border-none" altText="Try again">
                  <button className="inline-flex h-8 shrink-0 w-full py-1 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                    Đã hiểu
                  </button>
                </ToastAction>
              ),
              className: "bg-white border-rose-500",
            });
          } else {
            if (orderLogs?.hoadon_id) {
              res = await actionDelivery(
                orderLogs?.hoadon_id,
                Number(user.id),
                selectedValue.id
              );
            }
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
          }
        } else {
        }
      }}
      className={`grid items-start gap-4 `}
    >
      <div className="flex items-center gap-2 justify-between">
        {orderLogs?.trangthaidonhang_id == 1 ? (
          <>
            <SubmitButton
              cName="text-white"
              bgColor="bg-rose-500"
              bgColorHover="bg-rose-400"
              label={"Hủy"}
              name="btnCancel"
            />
            <SubmitButton
              cName="text-white"
              label={"Xác nhận"}
              name="btnConfirm"
            />
          </>
        ) : orderLogs?.trangthaidonhang_id == 2 ? (
          <>
            <Link
              href={"/admin/order"}
              className="w-full block hover:bg-gray-200 border rounded-md py-2 px-4 text-center"
            >
              Trở lại
            </Link>
            <SubmitButton
              cName="text-white"
              label={"Vận chuyển"}
              name="btnDelivery"
            />
          </>
        ) : (
          <>
            <Link
              href={"/admin/order"}
              className="w-full block hover:bg-gray-200 border rounded-md py-2 px-4 text-center"
            >
              Trở lại
            </Link>
          </>
        )}
      </div>
      <div>
        {orderLogs?.trangthaidonhang_id == 2 && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="countries"
              className="block w-2/12  text-sm font-medium text-gray-900 "
            >
              Giao hàng
            </label>
            <select
              id="countries"
              name="supplierName"
              onChange={handleChangeSelected}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            >
              <option value={""}>Chọn nhân viên giao hàng</option>
              {employeeList
                ? employeeList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.hoten}
                    </option>
                  ))
                : null}
            </select>
          </div>
        )}
      </div>
    </form>
  );
}

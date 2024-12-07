"use client";
import ImageKit from "@/components/imagekit";
import { FormatDate, FormatVND } from "@/helpers/utils";
import { cancelOrder, getOrderOfUser } from "@/lib/db";
import { ChiTietHoaDon, HoaDon, TrangThaiDonHang } from "@/lib/db/types";
import { User } from "next-auth";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submitButton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Rating from "@/components/Rating";
export default function OrderList({
  orderStatus,
  user,
}: {
  orderStatus: TrangThaiDonHang[];
  user: User;
}) {
  const [activeStatus, setActiveStatus] = useState<TrangThaiDonHang>(
    orderStatus[0]
  );
  const [isPending, startTransition] = useTransition();

  const [orderList, setOrderList] = useState<HoaDon[] | []>([]);

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const orderIdRef = useRef<number | null>(null);
  const actionCancel = cancelOrder.bind(null);

  const { toast } = useToast();

  function handleRemoveOrder(id: number) {
    orderList.length &&
      setOrderList(orderList.filter((item) => item.id !== id));
  }

  useEffect(() => {
    let ignore = false;
    startTransition(() => {
      getOrderOfUser(Number(user.id), activeStatus.id)
        .then((result) => {
          if (!ignore) {
            console.log(result);
            setOrderList(result);
          }
        })
        .catch((err: unknown) => {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
          console.log(errorMessage);
        });
    });

    return () => {
      ignore = true;
    };
  }, [activeStatus, user.id]);

  return (
    <div className="tabs">
      <div className="border-b bg-white shadow-sm border border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-700 ">
          <li className="mr-2">
            {orderStatus.map((item) => (
              <span
                key={item.id}
                onClick={() => !isPending && setActiveStatus(item)}
                className={`${
                  activeStatus.id === item.id
                    ? "border-b-2 text-rose-500 border-rose-500"
                    : ""
                } rounded-t-lg  inline-flex p-4 items-center justify-center group cursor-pointer`}
              >
                {item.ten}
              </span>
            ))}
          </li>
        </ul>
      </div>
      <div
        className={
          isPending
            ? "opacity-50 mt-6 border border-rose-300 transition-opacity duration-300"
            : "mt-6 transition-opacity duration-300"
        }
      >
        {orderList.length ? (
          <div className="content flex flex-col gap-5 border border-gray-200 shadow-md bg-white">
            {orderList.map((item) => (
              <div key={item.id}>
                <div className="bg-white p-4  mb-4 ">
                  <div className="flex items-center justify-between ">
                    <h4 className="text-blue-500 sm:text-base text-sm">
                      Mã đơn hàng: {item.id} |
                      <span className="text-gray-800">
                        {"  "}
                        {item.nhatKyDonHangs
                          ? item.nhatKyDonHangs[0].ngaytao &&
                            FormatDate({
                              isoDate: item.nhatKyDonHangs[0].ngaytao,
                            })
                          : null}
                      </span>
                    </h4>
                    <h4 className="whitespace-nowrap uppercase sm:text-base text-sm float-right p-2 text-rose-500">
                      {item.nhatKyDonHangs
                        ? item.nhatKyDonHangs[0].tentrangthai
                        : null}
                    </h4>
                  </div>
                  {item.chiTietHoaDons?.map((orderdetail: ChiTietHoaDon) => (
                    <div
                      key={`${orderdetail.hoadon_id}_${orderdetail.sanpham_id}`}
                      className="clear-both gap-1  flex justify-between py-2 items-center border-y border-gray-200 border-solid"
                    >
                      <div className="flex items-center gap-1">
                        <div className="relative h-20 w-20 rounded-lg">
                          {orderdetail.hinhanh && (
                            <ImageKit
                              path={orderdetail.hinhanh}
                              alt="image"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="sm:line-clamp-none line-clamp-1 sm:text-base text-sm">
                            {orderdetail.tensanpham}
                          </h4>
                          <span className="block sm:text-base text-sm">
                            Số lượng: {orderdetail.soluong}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong className="whitespace-nowrap">
                          {FormatVND({ amount: orderdetail.dongia ?? 0 })}
                        </strong>
                        {item.nhatKyDonHangs &&
                          (item.nhatKyDonHangs[0].trangthaidonhang_id === 4 ? (
                            <>
                              <Rating user={user} orderDetail={orderdetail} />
                              <Link
                                href={`/product/${orderdetail.sanpham_id}`}
                                className="btn-cancel hover:bg-blue-100 text-blue-500 border-blue-300 rounded-lg border-2 border-solid px-10 py-2  "
                              >
                                Mua lại
                              </Link>
                            </>
                          ) : null)}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end flex-col items-end">
                    <div className="pt-4 pb-4">
                      Thành tiền:
                      <strong className="sm:text-2xl text-lg text-rose-500">
                        {FormatVND({
                          amount: item.tongtien + item.phivanchuyen,
                        })}
                      </strong>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/don-hang/${item.id}`}
                        className="btn-cancel hover:bg-gray-100 text-gray-800 border-gray-300 border-2 border-solid px-10 py-2  "
                      >
                        Xem chi tiết
                      </Link>
                      {item.nhatKyDonHangs &&
                      item.nhatKyDonHangs[0].trangthaidonhang_id === 1 ? (
                        <button
                          type="button"
                          className="btn-cancel hover:bg-rose-400 hover:text-white border-rose-500 border-2 border-solid text-rose-500 px-10 py-2  "
                          onClick={() => {
                            if (item.id) {
                              orderIdRef.current = item.id;
                              setOpenCancelModal(true);
                            }
                          }}
                        >
                          Hủy đơn
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="clear-both" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-60 justify-center items-center gap-5 border border-gray-200 shadow-md bg-white">
            <div>
              <Image
                src={"/static/images/empty-order.png"}
                height={300}
                width={300}
                className="mx-auto h-auto w-24 rounded-full overflow-hidden"
                alt="logo-order"
              />
              <span className="md:text-base text-sm text-gray-600">
                Chưa có đơn hàng
              </span>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openCancelModal} onOpenChange={setOpenCancelModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[525px] bg-white">
          <DialogHeader>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng này không
            </DialogDescription>
          </DialogHeader>
          <form
            id="form-cancel-order"
            action={async () => {
              if (orderIdRef.current) {
                const res = await actionCancel(orderIdRef.current);
                if (res.status === 200) {
                  handleRemoveOrder(res.body ?? 0);
                  toast({
                    title: `Hủy thành công.`,
                    description: ``,
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
                  setOpenCancelModal(false);
                } else {
                  toast({
                    title: `Hủy không thành công.`,
                    description: `Vui lòng thực hiện lại!`,
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
              }
            }}
            className={`grid items-start gap-4 `}
          >
            <div className="flex items-center gap-2 justify-between">
              <Button
                onClick={() => setOpenCancelModal(false)}
                type="button"
                variant={"outline"}
                className="w-1/2"
              >
                Hủy
              </Button>
              <SubmitButton
                cName="w-1/2 bg-rose-500 hover:bg-rose-400 text-white"
                label={"Xác nhận"}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

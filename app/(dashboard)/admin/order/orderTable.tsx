"use client";
import CustomPagination from "@/components/customPagination";
import { FormatVND } from "@/helpers/utils";
import { cancelOrder, confirmOrder, getOrder } from "@/lib/db";
import { HoaDon, TrangThaiDonHang } from "@/lib/db/types";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/submitButton";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Image from "next/image";
import Link from "next/link";

export default function OrderTable({
  orderStatus,
  user,
}: {
  orderStatus: TrangThaiDonHang[];
  user: User;
}) {
  const [activeStatus, setActiveStatus] = useState<TrangThaiDonHang>(
    orderStatus[0]
  );

  const [isLoading, setIsLoading] = useState(false);

  const [orderList, setOrderList] = useState<HoaDon[] | []>([]);

  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const orderIdRef = useRef<number | null>(null);
  const actionConfirm = confirmOrder.bind(null);
  const actionCancel = cancelOrder.bind(null);
  const { toast } = useToast();
  useEffect(() => {
    let ignore = false;
    setOrderList([]);
    setIsLoading(true);
    getOrder(activeStatus.id)
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
      })
      .finally(() => setIsLoading(false));

    return () => {
      ignore = true;
    };
  }, [activeStatus]);

  function handleRemoveOrder(id: number) {
    orderList.length &&
      setOrderList(orderList.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-lg p-2">
        <div className="p-3 flex gap-4 items-center">
          {orderStatus.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveStatus(item)}
              className={`${
                activeStatus?.id === item.id
                  ? "text-white bg-indigo-500"
                  : "text-gray-800"
              } p-3 rounded-md border hover:bg-indigo-500 hover:text-white cursor-pointer`}
            >
              <span className="md:text-lg text-base ">{item.ten}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 ">
        <div className="bg-white rounded-lg">
          <div className="btn-toolbar border-b border-gray-300 px-5 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-3">
            <div className="pt-2 relative  text-gray-600 sm:w-auto w-full">
              <div>
                <form action="" method="get">
                  <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col items-start gap-4">
                    <input
                      className="submit_on_enter sm:w-auto  w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                      type="text"
                      name="s"
                      placeholder="Tìm kiếm đơn hàng..."
                      defaultValue=""
                    />
                    <div id="remove-all" className="sm:block hidden">
                      |
                    </div>
                    <div className="sm:w-auto w-full">
                      <label
                        htmlFor="sort"
                        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      />
                      <select
                        name="sx"
                        id="sort"
                        className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Sắp xếp đơn hàng</option>
                        <option value="gia_asc">Giá tăng dần</option>
                        <option value="gia_desc">Giá giảm dần</option>
                        <option value="ngaytao_asc">Ngày tăng dần</option>
                        <option value="ngaytao_desc">Ngày giảm dần</option>
                      </select>
                    </div>
                    <input
                      type="submit"
                      className="sr-only"
                      defaultValue="Submit"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            <table className="text-left w-full whitespace-nowrap">
              <thead className="bg-gray-200 text-gray-700">
                <tr className="border-b border-gray-300">
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="product_name"
                  >
                    ID
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="category_name"
                  >
                    Số lượng
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="price_dollor"
                  >
                    Tổng tiền
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="quantity_numbers"
                  >
                    Hình thức thanh toán
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="status_info"
                  >
                    Thanh toán
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="status_info"
                  >
                    Trạng thái
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="action_info"
                  ></th>
                </tr>
              </thead>
              <tbody className="list">
                {isLoading ? (
                  new Array(4).fill(1).map((item: number, index: number) => (
                    <tr key={index} className="animate-pulse border-b h-full ">
                      <td
                        colSpan={7}
                        className=" w-full h-6 m-2 bg-gray-200  "
                      ></td>
                    </tr>
                  ))
                ) : orderList.length ? (
                  orderList.map((item) => (
                    <tr key={item.id} className="border-b border-gray-300">
                      <td className="product_name px-6 py-3">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <h5 className="">{item.id}</h5>
                          </div>
                        </div>
                      </td>
                      <td className="category_name px-6 py-3">
                        {item.chiTietHoaDons &&
                          item.chiTietHoaDons?.reduce(
                            (prev, cur) => prev + cur.soluong,
                            0
                          )}
                      </td>
                      <td className="added_data px-6 py-3">
                        {FormatVND({
                          amount: item.tongtien + item.phivanchuyen,
                        })}
                      </td>
                      <td className="added_data px-6 py-3">
                        {item.thanhToan?.tenloaithanhtoan}
                      </td>
                      <td className="status_info px-6 py-3">
                        <span
                          className={`${
                            item.thanhToan?.trangthai
                              ? "text-green-500 bg-green-100 border-green-600"
                              : "text-orange-500 bg-orange-100 border-orange-600"
                          } px-2 py-1 border text-sm font-medium rounded-md inline-block whitespace-nowrap text-center`}
                        >
                          {item.thanhToan?.trangthai
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="added_data px-6 py-3">
                        {item.nhatKyDonHangs
                          ? item.nhatKyDonHangs[0].tentrangthai
                          : "---"}
                      </td>
                      <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                        <Link
                          href={`/admin/order/${item.id}`}
                          className="group py-1.5 px-3 rounded-md hover:bg-gray-100 hover:underline"
                        >
                          Xem chi tiết
                        </Link>
                        {item.nhatKyDonHangs &&
                          (item.nhatKyDonHangs[0].tentrangthai ===
                          "Chờ xác nhận" ? (
                            <>
                              <button
                                type="button"
                                className="group  rounded-md py-1.5 px-3  hover:text-green-500 hover:underline"
                                onClick={() => {
                                  if (item.id) {
                                    orderIdRef.current = item.id;
                                    setOpenConfirmModal(true);
                                  }
                                }}
                              >
                                Xác nhận
                              </button>
                              <button
                                type="button"
                                className="group  rounded-md py-1.5 px-3  hover:text-rose-500 hover:underline"
                                onClick={() => {
                                  if (item.id) {
                                    orderIdRef.current = item.id;
                                    setOpenRemoveModal(true);
                                  }
                                }}
                              >
                                Hủy
                              </button>
                            </>
                          ) : item.nhatKyDonHangs[0].tentrangthai ===
                            "Chuẩn bị hàng" ? (
                            <Link
                              href={`/admin/order/${item.id}`}
                              className="group  rounded-md py-1.5 px-3  hover:text-green-500 hover:underline"
                            >
                              Vận chuyển
                            </Link>
                          ) : null)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b h-full ">
                    <td colSpan={7} className=" w-full h-60  m-2 text-center ">
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
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row justify-end px-6 py-4 gap-2">
            <div>
              <CustomPagination />
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openConfirmModal} onOpenChange={setOpenConfirmModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[525px] bg-white">
          <DialogHeader>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng này không
            </DialogDescription>
          </DialogHeader>
          <form
            action={async () => {
              if (orderIdRef.current) {
                const res = await actionConfirm(
                  orderIdRef.current,
                  Number(user.id)
                );
                if (res.status === 200) {
                  handleRemoveOrder(res.body ?? 0);
                  toast({
                    title: `Xác nhận thành công.`,
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
                  setOpenConfirmModal(false);
                } else {
                  toast({
                    title: `Xác nhận không thành công.`,
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
                onClick={() => setOpenConfirmModal(false)}
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

      <Dialog open={openRemoveModal} onOpenChange={setOpenRemoveModal}>
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
                console.log(res);
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
                  setOpenRemoveModal(false);
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
                onClick={() => setOpenRemoveModal(false)}
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

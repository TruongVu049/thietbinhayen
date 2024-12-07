"use client";
import { ChiTietPhieuNhap, PhieuNhap } from "@/lib/db/types";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updatePurchaseOrder } from "@/lib/db";
import ImageKit from "@/components/imagekit";
import { FormatVND } from "@/helpers/utils";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import ExportWord from "@/components/handleFile/exportWord";
import { WarehouseReceipt } from "@/lib/types";
export default function EditForm({
  purchaseOrderP,
}: {
  purchaseOrderP: PhieuNhap;
}) {
  const { toast } = useToast();
  const [purchaseOrder, setPurchaseOrder] = useState<PhieuNhap>(purchaseOrderP);

  function updatePurchaseOrderItems(id: number, quantity: number) {
    setPurchaseOrder({
      ...purchaseOrder,
      chiTietPhieuNhaps: purchaseOrder.chiTietPhieuNhaps?.map((item) => {
        if (item.sanpham_id === id) {
          return {
            ...item,
            soluonghoantra: quantity,
          };
        }
        return item;
      }),
    });
  }

  async function handleSubmitButton(
    udQuantity: boolean,
    udQuantityState: boolean,
    udQuantityStatePm: boolean
  ) {
    const res = await updatePurchaseOrder(
      udQuantity,
      udQuantityState,
      udQuantityStatePm,
      purchaseOrder
    );
    if (res.status === 200) {
      setPurchaseOrder(res.body);
      toast({
        title: `Thông báo`,
        description: "Cập nhật phiếu nhập hàng thành công",
        action: (
          <ToastAction className="border-none" altText="Try again">
            <div className="flex gap-2 items-center">
              <Link
                href={"/admin/import"}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
              >
                Xem
              </Link>
            </div>
          </ToastAction>
        ),
        className: "bg-white border-green-500",
      });
    } else {
      toast({
        title: `Thông báo`,
        description: "Đã có lỗi xảy ra. Vui lòng thực hiện lại!",
        action: (
          <ToastAction className="border-none" altText="Try again">
            <div className="flex gap-2 items-center">
              <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                Thử lại
              </button>
            </div>
          </ToastAction>
        ),
        className: "bg-white border-rose-500",
      });
    }
  }

  return (
    <>
      <div className="">
        <div className="mr-6 flex items-center justify-start gap-3">
          <h1 className="xl:text-2xl text-xl font-semibold leading-6">
            Cập nhật phiếu nhập hàng
          </h1>
          <span
            className={`${
              !purchaseOrder.trangthaiphieunhap
                ? " bg-gray-100 text-gray-900 border-gray-900"
                : "bg-green-100 text-green-500 border-green-500"
            } border px-2 py-1  text-sm font-medium rounded-md inline-block whitespace-nowrap text-center`}
          >
            {purchaseOrder.trangthaiphieunhap ? "Hoàn thành" : "Đã nhập"}
          </span>
          <span
            className={`${
              !purchaseOrder.trangthaithanhtoan
                ? " bg-gray-100 text-gray-900 border-gray-900"
                : "bg-green-100 text-green-500 border-green-500"
            } border px-2 py-1  text-sm font-medium rounded-md inline-block whitespace-nowrap text-center`}
          >
            {!purchaseOrder.trangthaithanhtoan
              ? "Chưa thanh toán"
              : "Đã thanh toán"}
          </span>

          <div className="ml-auto">
            {purchaseOrder.trangthaiphieunhap && (
              <ExportWord
                data={
                  {
                    outputName: "PhieuNhapKho_" + Date.now().toString(),
                    url: "/templates/phieunhapkho.docx",
                    data: {
                      table: purchaseOrder.chiTietPhieuNhaps?.map(
                        (item: ChiTietPhieuNhap, index: number) => {
                          return {
                            index: index + 1,
                            ten: item.ten,
                            soluong: item.soluong,
                            soluongthuc:
                              item.soluong - (item.soluonghoantra ?? 0),
                            sanpham_id: item.sanpham_id,
                            dongia: item.dongia,
                            thanhtien:
                              item.dongia *
                              (item.soluong - (item.soluonghoantra ?? 0)),
                          };
                        }
                      ),
                      tongthanhtien: purchaseOrder.chiTietPhieuNhaps?.reduce(
                        (prev, cur) =>
                          prev +
                          cur.dongia *
                            (cur.soluong - (cur.soluonghoantra ?? 0)),
                        0
                      ),
                      tongsoluong: purchaseOrder.chiTietPhieuNhaps?.reduce(
                        (prev, cur) => prev + cur.soluong,
                        0
                      ),
                      tongsoluongthuc: purchaseOrder.chiTietPhieuNhaps?.reduce(
                        (prev, cur) =>
                          prev + (cur.soluong - (cur.soluonghoantra ?? 0)),
                        0
                      ),
                    },
                  } as WarehouseReceipt
                }
              >
                Xuất file
              </ExportWord>
            )}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-6 grid-cols-1 gap-3">
        <div className="grid gap-3 md:col-span-4 p-3 bg-white rounded-md text-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="pb-3 text-gray-900 md:text-lg text-base">
              Thông tin nhà cung cấp
            </h4>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="countries"
                className="block w-2/12  text-sm font-medium text-gray-900 "
              >
                Nhà cung cấp
              </label>
              <span className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                {purchaseOrder.ncc_ten}
              </span>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 p-3 bg-white rounded-md text-gray-700">
          <h4 className=" pb-3 text-gray-900 md:text-lg text-base">
            Thông tin đơn nhập hàng
          </h4>
          <div className="grid gap-2">
            <div className="flex items-center  gap-3 text-gray-900">
              <label className="block font-bold text-base">Nhân viên:</label>
              <span>{purchaseOrder.nhanvien_ten}</span>
            </div>

            <div className="flex items-center  gap-3 text-gray-900">
              <label htmlFor="countries" className="block font-bold text-base">
                Tổng tiền nhập hàng:
              </label>
              <strong className="md:text-2xl text-xl text-rose-500 font-bold">
                {FormatVND({ amount: purchaseOrder.tongtien })}
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 rounded-md bg-white">
        <div className="flex items-center justify-between mb-3">
          <h4 className=" pb-3 text-gray-900 md:text-lg text-base">
            Thông tin sản phẩm
          </h4>
        </div>
        <div className="relative overflow-x-auto">
          <table className="text-left w-full whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700">
              <tr className="border-b border-gray-300">
                <th className="listjs-sorter px-6 py-3">SST</th>
                <th className="listjs-sorter px-6 py-3">Sản phẩm</th>
                <th className="listjs-sorter px-6 py-3">Đơn giá nhập</th>
                <th className="listjs-sorter px-6 py-3">Số lượng</th>
                <th className="listjs-sorter px-6 py-3">Tổng tiền</th>
                <th className="listjs-sorter px-6 py-3">Số lượng hoàn trả</th>
                <th className="listjs-sorter px-6 py-3">Tổng tiền hoàn trả</th>
              </tr>
            </thead>
            <tbody className="list">
              {purchaseOrder.chiTietPhieuNhaps?.map(
                (item: ChiTietPhieuNhap, index: number) => (
                  <tr
                    key={item.sanpham_id}
                    className="border-b border-gray-300"
                  >
                    <td className="product_name px-6 py-3">{index + 1}</td>
                    <td className="category_name px-6 py-3">
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 rounded-lg">
                          <ImageKit
                            path={item.hinhanh ?? ""}
                            alt="image"
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-3">
                          <h5 className="">{item.ten}</h5>
                        </div>
                      </div>
                    </td>
                    <td className="text-rose-500 px-6 py-3">
                      {FormatVND({ amount: item.dongia })}
                    </td>
                    <td className=" px-6 py-3">{item.soluong}</td>
                    <td className="text-rose-500 px-6 py-3">
                      {FormatVND({ amount: item.soluong * item.dongia })}
                    </td>
                    <td className="added_data px-6 py-3">
                      <input
                        type="number"
                        value={item.soluonghoantra ?? 0}
                        className="py-2 border "
                        disabled={purchaseOrder.trangthaiphieunhap}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          if (
                            Number(e.currentTarget.value) >= 0 &&
                            Number(e.currentTarget.value) <= item.soluong
                          ) {
                            updatePurchaseOrderItems(
                              item.sanpham_id,
                              Number(e.currentTarget.value)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="text-rose-500 px-6 py-3">
                      {FormatVND({
                        amount: (item.soluonghoantra ?? 0) * item.dongia,
                      })}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-3 rounded-md bg-white">
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-3">
            <Button
              disabled={
                purchaseOrder.trangthaithanhtoan ||
                purchaseOrder.trangthaiphieunhap
              }
              onClick={() => handleSubmitButton(true, false, false)}
            >
              Cập nhật số lượng hoàn trả
            </Button>
            <Button
              disabled={purchaseOrder.trangthaiphieunhap}
              onClick={() => handleSubmitButton(true, true, false)}
            >
              Cập nhật số lượng hoàn trả & hoàn thành phiếu
            </Button>
            <Button
              disabled={purchaseOrder.trangthaiphieunhap}
              onClick={() => handleSubmitButton(true, true, true)}
            >
              Cập nhật số lượng hoàn trả & hoàn thành & thanh toán phiếu
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

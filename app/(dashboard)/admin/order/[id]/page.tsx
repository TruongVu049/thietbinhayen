import ImageKit from "@/components/imagekit";
import { FormatDate, FormatVND } from "@/helpers/utils";
import { getDeliveryEmployees, getOrderDetail } from "@/lib/db";
import { NhatKyDonHang } from "@/lib/db/types";
import { Check, Truck } from "lucide-react";
import FormActionOrder from "./formAction";
import { auth } from "@/auth";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const orderDetail = await getOrderDetail(Number(params.id));
  const employeeList = await getDeliveryEmployees();
  return (
    <div className="bg-[rgb(241_245_249)] px-6 pb-20 pt-6">
      <div className="flex items-center mb-4 gap-4">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Thông tin đơn hàng
        </h1>
        <span
          className="bg-green-100 px-6 md:text-lg text-base font-bold py-3 text-green-900 
        rounded-lg inline-block whitespace-nowrap text-center"
        >
          {orderDetail.nhatKyDonHangs &&
            orderDetail.nhatKyDonHangs[0].tentrangthai}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-8 col-span-12 bg-white shadow-md rounded-md">
          <div className="card">
            <div className="px-6 py-3 border-b border-gray-300">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold">ID: {orderDetail.id}</h4>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      Ngày tạo:{" "}
                      {orderDetail.ngaytao &&
                        FormatDate({ isoDate: orderDetail.ngaytao })}
                    </span>
                    <span>
                      Ngày cập nhật:{" "}
                      {orderDetail.nhatKyDonHangs &&
                        orderDetail.nhatKyDonHangs[0].ngaytao &&
                        FormatDate({
                          isoDate: orderDetail.nhatKyDonHangs[0].ngaytao,
                        })}
                    </span>
                    {orderDetail.vanChuyen && (
                      <span>
                        Người giao hàng: {orderDetail.vanChuyen.tennhanviengiao}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <FormActionOrder
                    orderLogs={
                      orderDetail.nhatKyDonHangs
                        ? orderDetail.nhatKyDonHangs[0]
                        : null
                    }
                    employeeList={employeeList}
                    user={session?.user}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="relative overflow-x-auto">
                <table className="text-left w-full whitespace-nowrap">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-6 py-3">Sản phẩm</th>
                      <th className="px-6 py-3">Đơn giá</th>
                      <th className="px-6 py-3">Số lượng</th>
                      <th className="px-6 py-3">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail.chiTietHoaDons &&
                      orderDetail.chiTietHoaDons.map((item) => (
                        <tr
                          key={item.hoadon_id + "_" + item.sanpham_id}
                          className="border-gray-300 border-b"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 rounded-lg">
                                {item.hinhanh && (
                                  <ImageKit
                                    path={item.hinhanh}
                                    alt="image"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                              <div>
                                <h5>{item.tensanpham}</h5>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            {FormatVND({ amount: item.dongia ?? 0 })}
                          </td>
                          <td className="px-6 py-3">{item.soluong}</td>
                          <td className="px-6 py-3">
                            {FormatVND({
                              amount: (item.dongia ?? 0) * item.soluong,
                            })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-4 col-span-12 bg-white ">
          <div className="mb-6 shadow-md rounded-md">
            <div className="relative overflow-x-auto">
              <table className="text-left w-full whitespace-nowrap">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Đơn hàng</th>
                    <th className="px-6 py-3">#{orderDetail.id}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-gray-300 border-b">
                    <td className="px-6 py-3">Số lượng</td>
                    <td className="px-6 py-3">
                      {orderDetail.chiTietHoaDons
                        ? orderDetail.chiTietHoaDons.reduce(
                            (prev, cur) => prev + cur.soluong,
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr className="border-gray-300 border-b">
                    <td className="px-6 py-3">Tổng</td>
                    <td className="px-6 py-3">
                      {FormatVND({ amount: orderDetail.tongtien })}
                    </td>
                  </tr>
                  <tr className="border-gray-300 border-b">
                    <td className="px-6 py-3">Phí vận chuyển</td>
                    <td className="px-6 py-3">
                      {FormatVND({ amount: orderDetail.phivanchuyen })}
                    </td>
                  </tr>
                  <tr className="border-gray-300 border-b">
                    <td className="px-6 py-3">Tổng tiền</td>
                    <td className="px-6 text-rose-500 text-lg font-bold py-3">
                      {FormatVND({
                        amount: orderDetail.tongtien + orderDetail.phivanchuyen,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-6 shadow-md rounded-md">
            <div className="relative overflow-x-auto">
              <table className="text-left w-full whitespace-nowrap">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Thông tin thanh toán</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-gray-300 border-b">
                    <td className="px-6 py-3">Loại</td>
                    <td className="px-6 py-3">
                      {orderDetail.thanhToan &&
                        orderDetail.thanhToan.tenloaithanhtoan}
                    </td>
                  </tr>

                  <tr className="border-gray-300 border-b">
                    <td className="px-6 py-3">Mã giao dịch</td>
                    <td className="px-6 py-3">
                      {orderDetail.thanhToan &&
                        orderDetail.thanhToan?.magiaodich}
                    </td>
                  </tr>

                  <tr className="border-gray-300 border-b">
                    <td className="px-6 py-3">Trạng thái</td>
                    {orderDetail.thanhToan && (
                      <td
                        className={`${
                          orderDetail.thanhToan?.trangthai
                            ? "text-green-500 bg-green-100 border-green-600"
                            : "text-orange-500 bg-orange-100 border-orange-600"
                        }  border text-sm font-medium rounded-md text-center`}
                      >
                        {orderDetail.thanhToan?.trangthai
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white p-4">
        <h6 className="md:text-xl text-xl font-bold text-gray-700 mb-4">
          Địa Chỉ Nhận Hàng
        </h6>
        <div className="grid grid-cols-10 gap-6">
          <div className="md:col-span-4 col-span-10 bg-white border-r-2">
            <h6 className="md:text-base text-sm font-bold text-gray-800">
              {orderDetail.tenkhachhang}
            </h6>
            <p className="text-gray-700">{orderDetail.diachinhanhang}</p>
          </div>
          <div className="md:col-span-6 col-span-10 bg-white">
            <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
              {orderDetail.nhatKyDonHangs &&
                orderDetail.nhatKyDonHangs.map(
                  (item: NhatKyDonHang, index: number) => (
                    <li
                      key={item.ngaytao?.toString()}
                      className={`mb-10 ms-6 flex items-center ${
                        index === 0 ? "text-emerald-700" : "text-gray-700"
                      }`}
                    >
                      <span
                        className={`absolute flex items-center justify-center w-8 h-8 border ${
                          index === 0
                            ? "border-green-500 bg-green-200"
                            : "border-gray-500 bg-gray-200"
                        } rounded-full -start-4 ring-4 ring-white `}
                      >
                        {item.tentrangthai === "Thành công" ? (
                          <Check
                            className={`w-5 h-5 ${
                              index === 0 ? "text-green-500" : "text-gray-700"
                            }`}
                          />
                        ) : item.tentrangthai === "Đang giao hàng" ? (
                          <Truck
                            className={`w-5 h-5 ${
                              index === 0 ? "text-green-500" : "text-gray-700"
                            }`}
                          />
                        ) : null}
                      </span>
                      <div className="flex gap-4 items-center ">
                        <p className="text-sm">
                          {item.ngaytao &&
                            FormatDate({ isoDate: item.ngaytao })}
                        </p>
                        <h3 className="font-bold leading-tight">
                          {item.tentrangthai}
                        </h3>
                      </div>
                    </li>
                  )
                )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

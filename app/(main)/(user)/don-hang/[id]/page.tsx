import ImageKit from "@/components/imagekit";
import { FormatDate, FormatVND } from "@/helpers/utils";
import { getOrderDetail } from "@/lib/db";
import { NhatKyDonHang } from "@/lib/db/types";
import { Check, ChevronLeft, PackageX, Truck } from "lucide-react";
import Link from "next/link";
import Rating from "@/components/Rating";
import { auth } from "@/auth";
import BackButton from "@/components/BackButton";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const order = await getOrderDetail(Number(params.id));

  function isPastSevenDays(dateString: string): boolean {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    const diffTime = currentDate.getTime() - givenDate.getTime();

    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 7;
  }

  return (
    <div className="bg-white">
      <div className="border rounded-md p-4 divide-y ">
        <div className="flex items-center justify-between text-gray-700 pb-4">
          <BackButton
            type="button"
            className="md:text-lg bg-transparent text-gray-700 hover:bg-transparent textbase flex gap-1 items-center"
          >
            <ChevronLeft className="w-5 h-5" />
            Trở lại
          </BackButton>
          <div>
            <div className="md:text-lg text-base uppercase flex items-center ">
              <h6>MÃ ĐƠN HÀNG. {order.id} </h6>
              <span className="mx-2">|</span>
              <span className="text-rose-600">
                {order.nhatKyDonHangs && order.nhatKyDonHangs[0].tentrangthai}
              </span>
            </div>
          </div>
        </div>
        <div className="py-4 divide-y">
          {order.chiTietHoaDons &&
            order.chiTietHoaDons.map((item) => (
              <div
                key={`${item.hoadon_id}_${item.sanpham_id}`}
                className="flex justify-between items-center flex-wrap gap-2"
              >
                <div className="flex gap-2 items-center">
                  <div className="relative h-16 w-16 rounded-lg">
                    {item.hinhanh && (
                      <ImageKit
                        path={item.hinhanh}
                        alt="image"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div>
                    {item.tensanpham}
                    <h6 className=" flex justify-between items-center">
                      x {item.soluong}
                      <strong className="md:text-lg text-base font-bold text-rose-500">
                        {FormatVND({
                          amount: (item.dongia ?? 0) * item.soluong,
                        })}
                      </strong>
                    </h6>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {order.nhatKyDonHangs &&
                  order.nhatKyDonHangs[0].trangthaidonhang_id === 4 ? (
                    <>
                      <Rating user={session?.user} orderDetail={item} />
                      <Link
                        href={`/product/${item.sanpham_id}`}
                        className="btn-cancel hover:bg-blue-100 text-blue-500 border-blue-300 rounded-lg border-2 border-solid px-10 py-2  "
                      >
                        Mua lại
                      </Link>
                    </>
                  ) : null}

                  {order.nhatKyDonHangs &&
                  order.nhatKyDonHangs[0].trangthaidonhang_id == 4 &&
                  order.nhatKyDonHangs[0].ngaytao &&
                  !isPastSevenDays(
                    order.nhatKyDonHangs[0]?.ngaytao.toString()
                  ) ? (
                    <Link
                      href={`/don-hang/doi-tra/${order.id}/${item.sanpham_id}`}
                      className="flex items-center gap-2 hover:bg-blue-100 rounded-lg border border-blue-500 border-solid text-blue-500 px-4 py-2 "
                    >
                      <PackageX />
                      Yêu Cầu Đổi - Trả
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
        </div>
        <div className="md:flex justify-end pt-4">
          <div className="lg:w-80 md:w-72 ">
            <h4 className="md:text-base text-sm flex justify-between items-center pb-2">
              Phương thức thanh toán:
              <span className="text-right">
                {order.thanhToan?.tenloaithanhtoan}
              </span>
            </h4>
            <h4 className="md:text-base text-sm flex justify-between items-center pb-2">
              Tổng tiền hàng:
              <span className="text-rose-500">
                {FormatVND({ amount: order.tongtien })}
              </span>
            </h4>
            <h4 className="md:text-base text-sm flex justify-between items-center pb-2">
              Phí vận chuyển:
              <span className="text-rose-500">
                {FormatVND({ amount: order.phivanchuyen })}
              </span>
            </h4>
            <h4 className="md:text-lg text-base flex justify-between items-center pb-2">
              Tổng thanh toán:
              <strong className="text-rose-500 md:text-2xl text-lg">
                {FormatVND({
                  amount: order.tongtien + order.phivanchuyen,
                })}
              </strong>
            </h4>
          </div>
        </div>
        <div
          className="h-1.5 w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)",
            backgroundPositionX: "-1.875rem",
            backgroundSize: "7.25rem .1875rem",
          }}
        ></div>
        <div className=" bg-white ">
          <h6 className="md:text-xl text-xl font-bold text-gray-700 mb-4">
            Địa Chỉ Nhận Hàng
          </h6>
          <div className="grid grid-cols-10 gap-6">
            <div className="md:col-span-4 col-span-10 bg-white border-r-2">
              <h6 className="md:text-base text-sm font-bold text-gray-800">
                {order.tenkhachhang}
              </h6>
              <p className="text-gray-700">{order.diachinhanhang}</p>
            </div>
            <div className="md:col-span-6 col-span-10 bg-white p-4">
              <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
                {order.nhatKyDonHangs &&
                  order.nhatKyDonHangs.map(
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
                              : "border-gray-400 bg-gray-100"
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
                          <h3 className="leading-tight">{item.tentrangthai}</h3>
                        </div>
                      </li>
                    )
                  )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import ChartComponent from "@/components/chart";
import { PieChartComponent } from "@/components/chart/PieChartComponent";
import ExportExcel from "@/components/handleFile/exportExcel";
import ImageKit from "@/components/imagekit";
import { FormatVND } from "@/helpers/utils";
import {
  getProfit,
  getQuantityReport,
  getRevenue,
  getTopSellingProducts,
  getTopUser,
} from "@/lib/db";
import { HoaDon } from "@/lib/db/types";
import { ChartCandlestick, UserCircle } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

export default async function AdminPage() {
  const quantilyReport = await getQuantityReport();

  const {
    soLuongKhachHang,
    soLuongNhanVien,
    soLuongSanPham,
    soLuongHoaDon,
    doanhThuHomNay,
  }: {
    soLuongKhachHang: number;
    soLuongNhanVien: number;
    soLuongSanPham: number;
    soLuongHoaDon: number;
    doanhThuHomNay: HoaDon[];
  } = quantilyReport;

  const topUser = await getTopUser();
  const topsellingProducts = await getTopSellingProducts();
  return (
    <main className=" space-y-6 p-4 sm:px-6 sm:py-0">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="text-4xl font-semibold mb-2">Tổng Quan</h1>
        </div>
      </div>
      <section className="grid grid-rows-2 md:grid-cols-2 xl:grid-cols-4 xl:gap-6 gap-4">
        <div className="flex xl:col-span-1 items-center  lg:p-6 p-4 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-10 sm:w-10 lg:h-14 lg:w-14 text-purple-600 bg-purple-100 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <span className="block text-2xl font-bold">{soLuongKhachHang}</span>
            <span className="text-gray-500 flex gap-2 flex-wrap">
              Khách hàng
              <span className="flex lg:hidden 2xl:flex relative  h-3 w-3 ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </span>
          </div>
        </div>
        <div className="flex xl:col-span-1 items-center  lg:p-6 p-4 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-10 sm:w-10 lg:h-14 lg:w-14 text-blue-600 bg-blue-100 rounded-full mr-6">
            <svg
              className="w-6 h-6 text-blue-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 19"
            >
              <path d="M10.013 4.175 5.006 7.369l5.007 3.194-5.007 3.193L0 10.545l5.006-3.193L0 4.175 5.006.981l5.007 3.194ZM4.981 15.806l5.006-3.193 5.006 3.193L9.987 19l-5.006-3.194Z" />
              <path d="m10.013 10.545 5.006-3.194-5.006-3.176 4.98-3.194L20 4.175l-5.007 3.194L20 10.562l-5.007 3.194-4.98-3.211Z" />
            </svg>
          </div>
          <div>
            <span className="block text-2xl font-bold">{soLuongSanPham}</span>
            <span className="text-gray-500 flex gap-2 flex-wrap">
              Sản phẩm
              <span className="flex lg:hidden 2xl:flex relative  h-3 w-3 ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </span>
          </div>
        </div>
        <div className="flex xl:col-span-1 items-center  lg:p-6 p-4 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-10 sm:w-10 lg:h-14 lg:w-14 text-green-600 bg-green-100 rounded-full mr-6">
            <svg
              className="w-6 h-6 text-green-400 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"
              />
            </svg>
          </div>
          <div>
            <span className="block text-2xl font-bold">{soLuongHoaDon}</span>

            <span className="text-gray-500 flex gap-2">Đơn hàng</span>
          </div>
        </div>
        <div className="flex xl:col-span-1 items-center  lg:p-6 p-4 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-10 sm:w-10 lg:h-14 lg:w-14 text-red-600 bg-teal-100 rounded-full mr-6">
            <svg
              className="w-6 h-6 text-teal-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                strokeWidth={2}
                d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <span className="inline-block text-2xl font-bold">
              {soLuongNhanVien}
            </span>
            <span className="text-gray-500 flex gap-2 ">
              Nhân viên
              <span className="flex lg:hidden 2xl:flex relative  h-3 w-3 ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </span>
          </div>
        </div>
        <div className="flex xl:col-span-2 gap-3 items-center  lg:p-6 p-4 bg-white shadow rounded-lg">
          <ExportExcel
            className={`${
              !doanhThuHomNay.length ? "pointer-events-none opacity-70" : ""
            }`}
            outputName="DoanhThuHomNay"
            data={doanhThuHomNay}
          >
            Xuất file doanh thu hôm nay
          </ExportExcel>
          <ExportExcel
            className={`pointer-events-none opacity-70`}
            outputName="DoanhThuHomNay"
            data={doanhThuHomNay}
          >
            Xuất file hàng tồn kho
          </ExportExcel>
        </div>
        <div className="flex xl:col-span-2 items-center  lg:p-6 p-4 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-10 sm:w-10 lg:h-14 lg:w-14 text-red-600 bg-sky-100 rounded-full mr-6">
            <ChartCandlestick className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <span className="inline-block text-2xl font-bold text-rose-500">
              {FormatVND({
                amount:
                  doanhThuHomNay.reduce(
                    (prev: number, cur: HoaDon) => prev + cur.tongtien,
                    0
                  ) ?? 0,
              })}
            </span>
            <span className="text-gray-500 flex gap-2">Doanh thu hôm nay</span>
          </div>
        </div>
      </section>
      <section className="grid xl:grid-cols-4 xl:gap-6 gap-4">
        <div className="xl:col-span-2  flex gap-6 flex-col bg-white shadow rounded-lg">
          <Suspense>
            <ChartComponent
              title={"Doanh Thu"}
              dataKey={"month"}
              dataName={"doanhthu"}
              action={getRevenue}
            />
          </Suspense>
        </div>
        <div className="xl:col-span-2  flex gap-6 flex-col bg-white shadow rounded-lg">
          <Suspense>
            <ChartComponent
              title={"Lợi Nhuận"}
              dataKey={"month"}
              dataName={"doanhthu"}
              action={getProfit}
            />
          </Suspense>
        </div>
        <div className="xl:col-span-1  shadow-lg flex gap-6 flex-col bg-white border-2 rounded-lg">
          <PieChartComponent />
        </div>
        <div className="xl:col-span-1  shadow-lg flex gap-6 flex-col bg-white border-2 rounded-lg">
          <div className="">
            <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
              <span className="flex justify-between w-full">
                Xếp hạng khách hàng
                <span className="font-medium">Tổng tiền mua</span>
              </span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
              <ul className="p-6 space-y-6">
                {topUser &&
                  topUser.map((item, index) => (
                    <li
                      key={item.id}
                      data-user-id={28}
                      className="flex items-center"
                    >
                      {index < 2 && (
                        <Image
                          src={`/static/images/no${index + 1}-1.png`}
                          height={300}
                          width={300}
                          className="h-auto w-10 object-cover"
                          alt="logo-order"
                        />
                      )}
                      <UserCircle className="w-6 h-6 text-gray-700" />
                      <span className="ml-2 text-gray-600">{item.ten}</span>
                      <span className="ml-auto font-semibold text-rose-500">
                        {FormatVND({ amount: item.tongtien })}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 shadow-lg flex gap-6 flex-col bg-white border-2 rounded-lg">
          <div className="">
            <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
              <span>Top Sản Phẩm mua nhiều</span>
              <span className="font-medium">Lượt mua</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
              <ul className="p-6 space-y-6">
                {topsellingProducts &&
                  topsellingProducts.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center flex-row md:gap-3 gap-1 w-full"
                    >
                      <div className="relative h-16 w-16 rounded-lg">
                        <ImageKit
                          path={item.hinhanh}
                          alt="image"
                          loading="lazy"
                          height={300}
                          width={400}
                          className="md:h-full h-auto w-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <div>
                          <h5 className="md:text-lg text-base md:leading-6 line-clamp-1 leading-4  text-black">
                            {item.ten}
                          </h5>

                          <h6 className="font-bold md:text-lg text-base md:leading-6 leading-4 text-rose-500">
                            {FormatVND({ amount: item.gia })}
                          </h6>
                        </div>
                        <div>{item.luotmua}</div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

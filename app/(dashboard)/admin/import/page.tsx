"use sever";

import CustomPagination from "@/components/customPagination";
import Sort from "@/components/Sort";
import { FormatVND } from "@/helpers/utils";
import { getPurchaseOrder } from "@/lib/db";
import { PhieuNhap } from "@/lib/db/types";
import Link from "next/link";
import { Suspense } from "react";

export default async function ImportPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    s?: string;
    p?: number;
    type?: string;
    trangthainhap?: string;
    trangthaithanhtoan?: string;
  };
}) {
  const type: string = searchParams?.type || "";
  const search: string = searchParams?.q || "";
  const currentPage: number = searchParams?.p || 1;
  const sort = searchParams?.s || "";
  const spo: string = searchParams?.trangthainhap || "";
  const spp: string = searchParams?.trangthaithanhtoan || "";

  const newSearchParams: string = `?q=${search}&p=${currentPage}&s=${sort}&type=${type}&trangthainhap=${spo}&trangthaithanhtoan=${spp}`;

  const { dspn, tongtrang } = await getPurchaseOrder({
    timkiem: search,
    trang: currentPage,
    sapxep: sort,
    loaiTimKiem: type,
    trangthainhap: spo,
    trangthaithanhtoan: spp,
  });

  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Phiếu nhập hàng
        </h1>
      </div>
      <div className="grid grid-cols-1 ">
        <div className="bg-white rounded-lg">
          <div className="btn-toolbar border-b border-gray-300 px-5 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-3">
            <div className="pt-2 relative  text-gray-600 sm:w-auto w-full">
              <div>
                <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col items-start gap-4">
                  <form action="/admin/import" method="get">
                    <div className="flex items-center justify-start">
                      <select
                        name="type"
                        className="border-2 border-r-0 py-2 px-1 rounded-l focus:outline-none"
                      >
                        <option value={""}>Tất cả</option>
                        <option value={"id"}>Tìm theo ID</option>
                        <option value={"tennv"}>Tìm tên nhân viên</option>
                        <option value={"tenncc"}>Tìm tên nhầ cung cấp</option>
                      </select>
                      <input
                        className=" w-full border-2 bg-white py-2 px-1  rounded-r text-sm focus:outline-none"
                        type="text"
                        name="q"
                        placeholder="Tìm kiếm..."
                        defaultValue=""
                      />
                    </div>

                    <input
                      type="submit"
                      className="sr-only"
                      defaultValue="Submit"
                    />
                  </form>
                  <div className="sm:block hidden">|</div>
                  <div className="sm:w-auto w-full">
                    <Sort
                      sort={[
                        {
                          title: "Mặc định",
                          slug: "",
                          sortKey: "Default",
                          reverse: false,
                        }, // asc
                        {
                          title: "Ngày tạo",
                          slug: "ngaytao",
                          sortKey: "CREATED_AT",
                          reverse: false,
                        }, // asc
                        {
                          title: "Tổng tiền tăng dần",
                          slug: "giatangdang",
                          sortKey: "PRICE",
                          reverse: false,
                        }, // asc
                        {
                          title: "Giá giảm dần",
                          slug: "giagiamdan",
                          sortKey: "PRICE",
                          reverse: true,
                        },
                      ]}
                    />
                  </div>
                  <Link
                    href={`
                      ${
                        spo !== ""
                          ? newSearchParams.replace(
                              "trangthainhap=danhap",
                              "trangthainhap="
                            )
                          : newSearchParams.replace(
                              "trangthainhap=",
                              "trangthainhap=danhap"
                            )
                      }
                      `}
                    className={`py-2 px-4 rounded-md border ${
                      spo !== ""
                        ? "border-white bg-gray-800 text-white hover:bg-gray-700"
                        : "text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    Chưa nhập hàng
                  </Link>
                  <Link
                    href={`
                      ${
                        spp !== ""
                          ? newSearchParams.replace(
                              "trangthaithanhtoan=chuathanhtoan",
                              "trangthaithanhtoan="
                            )
                          : newSearchParams.replace(
                              "trangthaithanhtoan=",
                              "trangthaithanhtoan=chuathanhtoan"
                            )
                      }
                      `}
                    className={`py-2 px-4 rounded-md border ${
                      spp !== ""
                        ? "border-white bg-gray-800 text-white hover:bg-gray-700"
                        : "text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    Chưa thanh toán
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-end -mb-3">
              <Link href="/admin/import/add">
                <button className="inline-flex px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 rounded-md ml-6 mb-3">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Tạo đơn nhập hàng
                </button>
              </Link>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            <table className="text-left w-full whitespace-nowrap">
              <thead className="bg-gray-200 text-gray-700">
                <tr className="border-b border-gray-300">
                  <th className="listjs-sorter px-6 py-3">Mã phiếu nhập</th>
                  <th className="listjs-sorter px-6 py-3">Nhân viên tạo</th>
                  <th className="listjs-sorter px-6 py-3">Nhà cung cấp</th>
                  <th className="listjs-sorter px-6 py-3">Ngày nhập</th>
                  <th className="listjs-sorter px-6 py-3">Ngày cập nhật</th>
                  <th className="listjs-sorter px-6 py-3">Tổng số lượng</th>
                  <th className="listjs-sorter px-6 py-3">Tổng tiền</th>
                  <th className="listjs-sorter px-6 py-3">Trạng thái nhập</th>
                  <th className="listjs-sorter px-6 py-3">
                    Trạng thái thanh toán
                  </th>
                  <th className="listjs-sorter px-6 py-3">Số lượng hoàn trả</th>
                  <th className="listjs-sorter px-6 py-3">
                    Tổng tiền hoàn trả
                  </th>
                  <th className="listjs-sorter px-6 py-3">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="list">
                {dspn.map((item: PhieuNhap) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className=" px-6 py-3">{item.id}</td>
                    <td className=" px-6 py-3">{item.nhanvien_ten}</td>
                    <td className=" px-6 py-3">{item.ncc_ten}</td>
                    <td className=" px-6 py-3">{item.ngaytao?.toString()}</td>
                    <td className=" px-6 py-3">
                      {" "}
                      {item.ngaycapnhat?.toString() ?? "--"}
                    </td>
                    <td className=" px-6 py-3">{item.tongsoluong}</td>

                    <td className="text-rose-500 px-6 py-3">
                      {FormatVND({ amount: item.tongtien })}
                    </td>
                    <td className=" px-6 py-3">
                      <span
                        className={`${
                          !item.trangthaiphieunhap
                            ? " bg-gray-100 text-gray-900 border-gray-900"
                            : "bg-green-100 text-green-500 border-green-500"
                        } border px-2 py-1  text-sm font-medium rounded-md inline-block whitespace-nowrap text-center`}
                      >
                        {item.trangthaiphieunhap ? "Hoàn thành" : "Đã nhập"}
                      </span>
                    </td>
                    <td className=" px-6 py-3">
                      <span
                        className={`${
                          !item.trangthaithanhtoan
                            ? " bg-gray-100 text-gray-900 border-gray-900"
                            : "bg-green-100 text-green-500 border-green-500"
                        } border px-2 py-1  text-sm font-medium rounded-md inline-block whitespace-nowrap text-center`}
                      >
                        {!item.trangthaithanhtoan
                          ? "Chưa thanh toán"
                          : "Đã thanh toán"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {item.soluonghoantra ?? "---"}
                    </td>
                    <td className="px-6 py-3">
                      {FormatVND({ amount: item.tongtienhoantra ?? 0 })}
                    </td>

                    <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                      <Link
                        href={`/admin/import/edit/${item.id}`}
                        className="group rounded-md py-1.5 px-3  hover:text-blue-500 hover:underline"
                      >
                        {item.trangthaiphieunhap ? "Xem chi tiết" : "Cập nhật"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tongtrang ? (
            <div className="flex flex-col md:flex-row justify-end px-6 py-4 gap-2">
              <Suspense>
                <CustomPagination totalPages={Number(tongtrang)} />
              </Suspense>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

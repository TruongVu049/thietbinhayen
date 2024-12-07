"use client";
import CustomPagination from "@/components/customPagination";
import { getReturnOrder } from "@/lib/db";
import { ChiTietDoiTra, TrangThaiDonHang } from "@/lib/db/types";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import ImageKit from "@/components/imagekit";

export default function ReturnOrderTable({
  orderStatus,
}: {
  orderStatus: TrangThaiDonHang[];
}) {
  const [activeStatus, setActiveStatus] = useState<TrangThaiDonHang>(
    orderStatus[0]
  );

  const [isLoading, setIsLoading] = useState(false);

  const [returnOrderList, setReturnOrderList] = useState<ChiTietDoiTra[] | []>(
    []
  );

  useEffect(() => {
    let ignore = false;
    setReturnOrderList([]);
    getReturnOrder(activeStatus.id)
      .then((result) => {
        if (!ignore) {
          console.log(result);
          setReturnOrderList(result);
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
                    Sản phẩm
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="product_name"
                  >
                    Mã hóa đơn góc
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="category_name"
                  >
                    Số lượng trả
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="category_name"
                  >
                    Lý do
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="price_dollor"
                  >
                    Phương pháp
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="quantity_numbers"
                  >
                    Chi tiết lỗi
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
                ) : returnOrderList.length ? (
                  returnOrderList.map((item) => (
                    <tr
                      key={`${item.sanpham_id}_${item.doitra_id}`}
                      className="border-b border-gray-300"
                    >
                      <td className="product_name px-6 py-3">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <h5 className="">{`${item.doitra_id}`}</h5>
                          </div>
                        </div>
                      </td>
                      <td className="product_name px-6 py-3">
                        <div className="flex items-center">
                          <div className="relative h-12 w-12 rounded-lg">
                            {item.hinhanhsanpham && (
                              <ImageKit
                                path={item.hinhanhsanpham}
                                alt="image"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <div className="ml-3">
                            <h5 className="">{item.tensanpham}</h5>
                          </div>
                        </div>
                      </td>
                      <td className="category_name px-6 py-3">
                        <Link
                          className="text-blue-600 hover:underline"
                          href={`/admin/order/${item.doiTraDTO?.hoadon_id}`}
                        >
                          Hóa đơn #{item.doiTraDTO?.id}
                        </Link>
                      </td>

                      <td className="category_name px-6 py-3">
                        {item.soluong}
                      </td>
                      <td className="added_data px-6 py-3">
                        <p className="line-clamp-2">{item.lydodoitra}</p>
                      </td>
                      <td className="added_data px-6 py-3">
                        {item.tenloaiyeucaudoitra}
                      </td>
                      <td className="added_data px-6 py-3">
                        {item.tengiaiphapdoitra}
                      </td>
                      <td className="status_info px-6 py-3">
                        {item.trangthai}
                      </td>
                      <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                        <Link
                          href={`/admin/order/return/${item.doitra_id}/${item.sanpham_id}`}
                          className="group py-1.5 px-3 rounded-md hover:bg-gray-100 hover:underline"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b h-full ">
                    <td colSpan={10} className=" w-full h-60  m-2 text-center ">
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
    </div>
  );
}

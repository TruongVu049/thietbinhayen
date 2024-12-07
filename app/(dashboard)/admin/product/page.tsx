import CustomPagination from "@/components/customPagination";
import ImageKit from "@/components/imagekit";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/db";
import ProductSort from "@/components/product/productSort";
import { Suspense } from "react";
import { SanPham } from "@/lib/db/types";
import { FormatVND } from "@/helpers/utils";
import ImportProduct from "@/components/handleFile/ImportProduct";
export default async function ProductAdminPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    sort?: string;
    p?: number;
    type?: string;
    status?: string;
    qt?: string;
  };
}) {
  const type: string = searchParams?.type || "";
  const search: string = searchParams?.q || "";
  const currentPage: number = searchParams?.p || 1;
  const sort = searchParams?.sort || "";

  const status = searchParams?.status || "true";
  const qt: string = searchParams?.qt || "";

  const newSearchParams: string = `?q=${search}&p=${currentPage}&sort=${sort}&type=${type}&status=${status}&qt=${qt}`;

  const { dssp, tongtrang } = await getProducts({
    trang: currentPage,
    sapxep: sort,
    trangthai: status === "true" ? true : false,
  });
  let productList = dssp.slice();
  if (type !== "") {
    if (type === "id")
      productList = dssp.filter((item) => item.id == Number(search));
    else if (type === "tensp")
      productList = dssp.filter(
        (item) => item.ten.includes(search) || search.includes(item.ten)
      );
  } else {
    productList = dssp.filter(
      (item) =>
        item.ten.includes(search) ||
        search.includes(item.ten) ||
        item.id == Number(search)
    );
  }

  if (qt !== "") {
    productList = dssp.filter((item) => item.soluong < 3);
  }

  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Sản phẩm
        </h1>
      </div>
      <div className="grid grid-cols-1 ">
        <div className="bg-white rounded-lg">
          <div className="btn-toolbar border-b border-gray-300 px-5 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-3">
            <div className="pt-2 relative  text-gray-600 sm:w-auto w-full">
              <div>
                <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col items-start gap-4">
                  <form action="/admin/product" method="get">
                    <div className="flex items-center justify-start">
                      <select
                        name="type"
                        defaultValue={type}
                        className="border-2 border-r-0 py-2 px-1 rounded-l focus:outline-none"
                      >
                        <option value={""}>Tất cả</option>
                        <option value={"id"}>Tìm theo ID</option>
                        <option value={"tensp"}>Tìm tên sản phẩm</option>
                      </select>
                      <input
                        className=" w-full border-2 bg-white py-2 px-1  rounded-r text-sm focus:outline-none"
                        type="text"
                        name="q"
                        placeholder="Tìm kiếm..."
                        defaultValue={search}
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
                    <ProductSort />
                  </div>

                  <Link
                    href={`
                      ${
                        qt !== ""
                          ? newSearchParams.replace("qt=sanphamhethang", "qt=")
                          : newSearchParams.replace("qt=", "qt=sanphamhethang")
                      }
                      `}
                    className={`py-2 px-4 rounded-md border ${
                      qt !== ""
                        ? "border-white bg-gray-800 text-white hover:bg-gray-700"
                        : "text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    Sản phẩm gần hết hàng
                  </Link>
                  <Link
                    href={`
                      ${
                        status === "false"
                          ? newSearchParams.replace("status=false", "status=")
                          : newSearchParams.replace(
                              "status=true",
                              "status=false"
                            )
                      }
                      `}
                    className={`py-2 px-4 rounded-md border flex gap-1 ${
                      status === "false"
                        ? "border-white bg-rose-500 text-white hover:bg-rose-500 "
                        : "text-gray-800 border-gray-800 group hover:bg-rose-500 hover:text-white"
                    }`}
                  >
                    <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-white" />
                    Sản phẩm đã xóa
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-start justify-end -mb-3">
              <ImportProduct />
              <Link href="/admin/product/add">
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
                  Thêm Sản Phẩm
                </button>
              </Link>
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
                    Sản phẩm
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="category_name"
                  >
                    Danh mục
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="added_data"
                  >
                    Ngày Tạo
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="price_dollor"
                  >
                    Giá
                  </th>
                  <th
                    className="listjs-sorter px-6 py-3"
                    data-sort="quantity_numbers"
                  >
                    Số lượng
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
                {productList.map((item: SanPham) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="product_name px-6 py-3">
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 rounded-lg">
                          <ImageKit
                            path={item.hinhanh}
                            alt="image"
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-3">
                          <h5 className="">{item.ten}</h5>
                        </div>
                      </div>
                    </td>
                    <td className="category_name px-6 py-3">
                      {item?.danhmuc ?? ""}
                    </td>
                    <td className="added_data px-6 py-3">
                      {item.ngaytao?.toString()}
                    </td>
                    <td className="text-rose-500 font-bold px-6 py-3">
                      {FormatVND({ amount: item.gia })}
                    </td>
                    <td className="quantity_numbers px-6 py-3">
                      {item.soluong ?? 0}
                    </td>
                    <td className="status_info px-6 py-3">
                      {item.trangthai ? (
                        <span className="bg-green-100 px-2 py-1 text-green-900 text-sm font-medium rounded-md inline-block whitespace-nowrap text-center">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-100 px-2 py-1 text-gray-900 text-sm font-medium rounded-md inline-block whitespace-nowrap text-center">
                          Disable
                        </span>
                      )}
                    </td>
                    <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                      <Link
                        href={`/admin/product/edit/${item.id}`}
                        className="group  rounded-md py-1.5 px-3  hover:text-blue-500 hover:underline"
                      >
                        Cập nhật
                      </Link>
                      {status != "false" && (
                        <Link
                          href={`/admin/product/edit/${item.id}`}
                          className="group  rounded-md py-1.5 px-3  hover:text-rose-500 hover:underline"
                        >
                          Xóa
                        </Link>
                      )}
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

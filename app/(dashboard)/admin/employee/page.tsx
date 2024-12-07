"use client";

import { UserCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getEmployees } from "@/lib/db";
import ProductSort from "@/components/product/productSort";
import { SortFilterItem } from "@/lib/constants";
import { DeleteEmployee } from "./delete-employee";
import { NhanVien } from "@/lib/db/types";

const sorting: SortFilterItem[] = [
  { title: "Mặc định", slug: "", sortKey: "Default", reverse: false },
  { title: "Theo tên", slug: "hoten", sortKey: "Default", reverse: false },
  {
    title: "Ngày vào làm",
    slug: "ngaytao",
    sortKey: "Default",
    reverse: false,
  },
];

export default function EmployeePage({
  searchParams,
}: {
  searchParams?: { q?: string; sort?: string; type?: string; status?: string };
}) {
  const [employees, setEmployees] = useState<NhanVien[]>([]);
  const search = searchParams?.q || "";
  const sort = searchParams?.sort || "";
  const type: string = searchParams?.type || "";
  const status = searchParams?.status || "true";

  // Fetch employees on mount and when searchParams change
  useEffect(() => {
    async function fetchEmployees() {
      const data = await getEmployees({
        timkiem: "",
        sapxep: sort,
        trangthai: status === "true" ? true : false,
      });
      setEmployees(data);
    }
    fetchEmployees();
  }, [search, sort, type, status]);

  // Function to handle removing an employee from the list
  const handleRemoveEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const newSearchParams: string = `?q=${search}&sort=${sort}&type=${type}&status=${status}`;

  let employeeList: NhanVien[] = employees.slice();

  if (type !== "") {
    if (type === "id")
      employeeList = employees.filter((item) => item.id == Number(search));
    else if (type === "tensp")
      employeeList = employees.filter(
        (item) => item.hoten.includes(search) || search.includes(item.hoten)
      );
  } else
    employeeList = employees.filter(
      (item) =>
        item.hoten.includes(search) ||
        search.includes(item.hoten) ||
        item.id == Number(search)
    );

  return (
    <div className="bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Nhân Viên
        </h1>
      </div>
      <div className="grid grid-cols-1 ">
        <div className="bg-white rounded-lg">
          <div className="btn-toolbar border-b border-gray-300 px-5 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-3">
            <div className="flex items-center gap-2">
              <form action="/admin/employee" method="get">
                <div className="flex items-center justify-start">
                  <select
                    name="type"
                    defaultValue={type}
                    className="border-2 border-r-0 py-2 px-1 rounded-l focus:outline-none"
                  >
                    <option value={""}>Tất cả</option>
                    <option value={"id"}>Tìm theo ID</option>
                    <option value={"tennv"}>Tìm tên nhân viên</option>
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
              <ProductSort sort={sorting} />
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
                Nhân viên đã nghỉ
              </Link>
            </div>
            <Link href="/admin/employee/handle">
              <button className="inline-flex px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md ml-6">
                Thêm Nhân Viên
              </button>
            </Link>
          </div>
          <div className="relative overflow-x-auto">
            <table className="text-left w-full whitespace-nowrap">
              <thead className="bg-gray-200 text-gray-700">
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-3">Nhân viên</th>
                  <th className="px-6 py-3">Họ tên</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Ngày làm</th>
                  <th className="px-6 py-3">Chức vụ</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {employeeList.length
                  ? employeeList.map((item) => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="px-6 py-3 flex items-center">
                          <UserCircle className="h-8 w-8 text-blue-700" />
                          <span className="ml-3">{item.id}</span>
                        </td>
                        <td className="px-6 py-3">{item.hoten}</td>
                        <td className="px-6 py-3">{item.email}</td>
                        <td className="px-6 py-3">
                          {item.ngaytao?.toString()}
                        </td>
                        <td className="px-6 py-3">{item.phanQuyen?.ten}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`${
                              item.trangthai ? "bg-green-200" : "bg-rose-200"
                            } px-2 py-1 rounded-md text-sm font-medium`}
                          >
                            {item.trangthai ? "Đang làm" : "Đã nghỉ"}
                          </span>
                        </td>
                        <td className="px-6 py-3 flex items-center gap-1">
                          <Link
                            href={`/admin/employee/handle/${item.id}`}
                            className="group  rounded-md py-1.5 px-3  hover:text-blue-500 hover:underline"
                          >
                            Cập nhật
                          </Link>
                          {status !== "false" && (
                            <DeleteEmployee
                              empId={item.id}
                              onRemove={handleRemoveEmployee}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  : new Array(4).fill(1).map((item: number, index: number) => (
                      <tr
                        key={index}
                        className="animate-pulse border-b h-full "
                      >
                        <td
                          colSpan={7}
                          className=" w-full h-6 m-2 bg-gray-200  "
                        ></td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

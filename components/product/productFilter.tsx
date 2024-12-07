"use client";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createUrl } from "@/helpers/utils";
import { useRouter } from "next/navigation";
import { DanhMuc } from "@/lib/db/types";

export default function ProductFilter({
  categories,
}: {
  categories: DanhMuc[];
}) {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const categories = formData.getAll("category").map(String);
    const minPrice = formData.get("gia-toi-thieu")?.toString() || "";
    const maxPrice = formData.get("gia-toi-da")?.toString() || "";

    if (
      (minPrice !== "" &&
        maxPrice !== "" &&
        Number(minPrice) > Number(maxPrice)) ||
      (minPrice !== "" && maxPrice === "") ||
      (minPrice === "" && maxPrice !== "")
    ) {
      setError("Vui lòng điền vào giá trị hợp lệ");
    } else {
      setError("");
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("q", search);
      }

      if (categories.length > 0) {
        params.set("categories", categories.join("_")); // Gộp categories thành một chuỗi
      } else {
        params.delete("categories");
      }

      if (minPrice) {
        params.set("minPrice", minPrice);
      } else {
        params.delete("minPrice");
      }

      if (maxPrice) {
        params.set("maxPrice", maxPrice);
      } else {
        params.delete("maxPrice");
      }

      const newUrl = createUrl(pathname, params);
      router.push(newUrl);
    }
  }

  return (
    <div className=" bg-white w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 md:mb-4 mb-2">
          <p className="font-medium text-base leading-7 text-black ">Filter</p>
          <button
            type="reset"
            className="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-indigo-600"
          >
            Làm mới
          </button>
        </div>

        <div>
          <p className="font-medium text-base leading-6 text-black pb-3">
            Danh mục
          </p>
          {categories?.map((item: DanhMuc) => (
            <div key={item.id} className="pb-3">
              <label
                key={item.id}
                htmlFor={item.ten}
                className="flex font-medium  flex-row-reverse items-center justify-end duration-200  cursor-pointer  text-sm"
              >
                {item.ten}{" "}
                <input
                  name="category"
                  value={item.id}
                  className="accent-rose-500 h-5 w-5 mr-3 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  type="checkbox"
                />
              </label>
            </div>
          ))}
        </div>
        <div>
          <p className="font-medium text-base leading-6 text-black mb-2">Giá</p>
          <div className="mb-3">
            <label htmlFor="gia-toi-thieu" className="flex items-center gap-1">
              <span className="w-1/4">Từ</span>
              <input
                type="number"
                name="gia-toi-thieu"
                placeholder="VNĐ"
                min={0}
                max={999999999}
                className="text-right w-full border rounded-md"
              />
            </label>
          </div>
          <div>
            <label htmlFor="gia-toi-da" className="flex items-center gap-1">
              <span className="w-1/4">Đến</span>
              <input
                type="number"
                name="gia-toi-da"
                placeholder="VNĐ"
                min={1}
                max={999999999}
                className="text-right w-full border rounded-md"
              />
            </label>
          </div>
          {error && (
            <span className="inline-block md:text-base text-sm mt-2 text-rose-500">
              {error}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 w-full py-2.5 flex items-center justify-center gap-2 rounded-full bg-gray-800 text-white font-semibold text-xs shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-800 hover:shadow-indigo-200  "
        >
          <SearchIcon className="w-5 h-5 text-white" />
          Tìm kiếm
        </button>
      </form>
    </div>
  );
}

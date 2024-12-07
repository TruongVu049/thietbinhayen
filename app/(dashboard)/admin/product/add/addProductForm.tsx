"use client";
import FilesInput from "@/components/filesInput";
import Editor from "@/components/Editor";
import Upload from "@/components/upload";
import { Suspense } from "react";
import TableEditing from "@/components/tableEditing";
import { DanhMuc, XuatXu } from "@/lib/db/types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "@/schemas";
import { Loader2 } from "lucide-react";
import { FileInput, Row } from "@/lib/types";
import { createProducts } from "@/lib/db";
import { useRouter } from "next/navigation";
const idFirstFile = Date.now();

export default function AddProductForm({
  danhmucs,
  xuatxus,
}: {
  danhmucs: DanhMuc[];
  xuatxus: XuatXu[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [image, setImage] = useState<FileInput | null>(null);
  //data table editing
  const [rows, setRows] = useState<Row[]>([]);
  const [description, setDescription] = useState("");
  //image list
  const [imageList, setImageList] = useState<FileInput[]>([
    {
      id: idFirstFile,
      url: null,
    },
  ]);
  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setError("");
    if (!image) setError((err) => err + " Vui lòng thêm ảnh đại diện.");
    if (!rows || !rows.length)
      setError((err) => err + " Vui lòng thêm ít nhất một thông số sản phẩm.");
    if (!description) setError((err) => err + " Vui lòng thêm mô tả sản phẩm.");
    if (error === "") {
      setIsLoading(true);

      try {
        const res = await createProducts({
          data: data,
          image: image,
          imageList: imageList,
          rows: rows,
          description: description,
        });

        if (res.status === 200) {
          // toast(res?.body?.message ?? "Tạo sản phẩm thành công!", {
          //   duration: 2000,
          // });

          // setTimeout(() => {
          //   router.push("/admin/product");
          // }, 2000);
          router.push("/admin/product");
        } else {
          setError("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } catch (err) {
        setError("Lỗi hệ thống, vui lòng thử lại sau!");
      } finally {
        setIsLoading(false);
      }
    }
  };
  //handle image
  function handleImage(url: string) {
    setImage({
      id: Date.now(),
      url: url,
    });
  }

  //handle image list
  const handleAddFileInput = (): void => {
    setImageList([...imageList, { id: Date.now(), url: null }]);
  };

  function handleFileInput(url: string, id?: number) {
    setImageList(
      imageList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            url: url,
          };
        }
        return item;
      })
    );
  }

  function handleRemoveInput(id: number) {
    setImageList(imageList.filter((item) => item.id !== id));
  }

  return (
    <form
      className="sm:p-4 p-2 bg-white rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-5">
        <label
          htmlFor="ten"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Tên sản phẩm
        </label>
        <input
          {...register("ten")} // Liên kết input email với react-hook-form
          disabled={isLoading}
          id="ten"
          type="text"
          required
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
        {errors.ten && (
          <p className="md:text-base text-sm text-rose-500">
            {errors.ten.message}
          </p>
        )}
      </div>
      <div className="mb-5"></div>
      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="gia"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Giá tiền
            </label>
            <input
              {...register("gia")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              id="gia"
              type="number"
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.gia && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.gia.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="xuatxu_id"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Xuất xứ
            </label>
            <select
              {...register("xuatxu_id")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              id="xuatxu_id"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            >
              {xuatxus?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tennuoc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="thuonghieu"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Thương hiệu
            </label>
            <input
              {...register("thuonghieu")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              id="thuonghieu"
              type="string"
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.thuonghieu && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.thuonghieu.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="danhmuc_id"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Danh mục
            </label>
            <select
              {...register("danhmuc_id")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              id="danhmuc_id"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            >
              {danhmucs?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.ten}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="-mx-3 grid md:grid-cols-3 grid-cols-1">
        <div className="w-full px-3">
          <div className="mb-5">
            <label
              htmlFor="baohanh"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Bảo hàng
            </label>
            <input
              {...register("baohanh")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              id="baohanh"
              type="number"
              required
              placeholder="Tháng"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.baohanh && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.baohanh.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full px-3 ">
          <div className="mb-5">
            <label
              htmlFor="khoiluong"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Khối lượng
            </label>
            <input
              {...register("khoiluong")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              id="khoiluong"
              type="number"
              required
              placeholder="kg"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.khoiluong && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.khoiluong.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full px-3 ">
          <div className="mb-5">
            <label
              htmlFor="kichthuoc"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Kích thước
            </label>
            <input
              {...register("kichthuoc")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              id="kichthuoc"
              type="text"
              required
              placeholder="Dài x rộng"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.kichthuoc && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.kichthuoc.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="mota"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Ảnh đại diện
        </label>
        <span className="inline-block border border-indigo-500 p-3 rounded-lg">
          <Upload uploadedFilePath={image} onUploadedFilePath={handleImage} />
        </span>
      </div>
      <div className="mb-5">
        <label
          htmlFor="mota"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Hình ảnh sản phẩm
        </label>
        <FilesInput
          imageList={imageList}
          onChangeAddFileInput={handleAddFileInput}
          onChangeFileInput={handleFileInput}
          onChangeRemoveInput={handleRemoveInput}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="thongsokythuat"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Thông số kỹ thuật
        </label>
        <Suspense>
          <TableEditing rows={rows} onChangeRows={setRows} />
        </Suspense>
      </div>
      <div className="mb-5">
        <label
          htmlFor="thongsokythuat"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Mô tả
        </label>
        <Suspense>
          <Editor
            description={description}
            onChangeDescription={setDescription}
          />
        </Suspense>
      </div>
      <div className="mb-5">
        <label
          htmlFor="trangthai"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Public
        </label>
        <span>
          <label className="inline items-center cursor-pointer">
            <input
              {...register("trangthai")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              type="checkbox"
              name="trangthai"
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </span>
      </div>
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="text-red-500 md:text-base text-sm pb-3">{error}</div>
      )}
      <div>
        <button
          disabled={isLoading}
          type="submit"
          className={`hover:shadow-form flex items-center justify-center w-full rounded-md ${
            isLoading ? "bg-indigo-400" : "bg-[#6A64F1]"
          } hover:bg-indigo-400 py-3 px-8 text-center text-base font-semibold text-white outline-none`}
        >
          <Loader2
            className={`mr-2 h-4 w-4 animate-spin ${
              isLoading ? "block" : "hidden"
            }`}
          />
          Thêm
        </button>
      </div>
    </form>
  );
}

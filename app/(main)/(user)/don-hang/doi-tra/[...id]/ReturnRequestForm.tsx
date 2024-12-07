"use client";
import { useState } from "react";

import { SubmitButton } from "@/components/submitButton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { GiaiPhapDoiTra, LoaiYeuCauDoiTra, SanPham } from "@/lib/db/types";
import { Label } from "@/components/ui/label";
import ImageKit from "@/components/imagekit";
import { FormatVND } from "@/helpers/utils";
import { FileInput } from "@/lib/types";
import FilesInput from "@/components/filesInput";
import { createRequestReturn } from "@/lib/db";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function ReturnRequestForm({
  orderId,
  productData,
  solutinData,
  typeData,
}: {
  orderId: number;
  productData: SanPham;
  solutinData: GiaiPhapDoiTra[];
  typeData: LoaiYeuCauDoiTra[];
}) {
  const { toast } = useToast();
  const [imageList, setImageList] = useState<FileInput[]>([
    {
      id: Date.now(),
      url: null,
    },
  ]);
  const [error, setError] = useState({
    quantity: "",
    image: "",
    reason: "",
    content: "",
    solution: "",
  });

  const actionUpdate = createRequestReturn.bind(null);

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
      className="grid items-start gap-4"
      action={async (formData: FormData) => {
        let isValid = true;
        const quantity = formData.get("quantity");
        const solution = formData.get("solution");
        const content = formData.get("content");
        const reason = formData.get("reason");
        if (!quantity) {
          setError((err) => {
            return {
              ...err,
              quantity: "Vui lòng điền vào số lượng",
            };
          });
          isValid = false;
        } else {
          if (productData.soluong < Number(quantity)) {
            setError((err) => {
              return {
                ...err,
                quantity: "Số lượng đổi trả không hợp lệ!",
              };
            });
            isValid = false;
          } else {
            setError((err) => {
              return {
                ...err,
                quantity: "",
              };
            });
          }
        }
        if (!reason || reason === "") {
          setError((err) => {
            return {
              ...err,
              reason: "Vui lòng chọn lý do đổi trả!",
            };
          });
          isValid = false;
        } else {
          setError((err) => {
            return {
              ...err,
              reason: "",
            };
          });
        }
        if (!content) {
          setError((err) => {
            return {
              ...err,
              content: "Vui lòng điền vào chi tiết lý do!",
            };
          });
          isValid = false;
        } else {
          setError((err) => {
            return {
              ...err,
              content: "",
            };
          });
        }
        if (!solution || solution === "") {
          setError((err) => {
            return {
              ...err,
              solution: "Vui lòng chọn giải pháp!",
            };
          });
          isValid = false;
        } else {
          setError((err) => {
            return {
              ...err,
              solution: "",
            };
          });
        }
        if (!imageList.length || !imageList[0].url) {
          setError((err) => {
            return {
              ...err,
              image: "Vui lòng thêm hình ảnh đổi trả!",
            };
          });
          isValid = false;
        } else {
          setError((err) => {
            return {
              ...err,
              image: "",
            };
          });
        }
        if (isValid) {
          setError({
            quantity: "",
            image: "",
            reason: "",
            content: "",
            solution: "",
          });
          const res = await actionUpdate({
            payload: {
              orderId: orderId,
              content: content as string,
              images: imageList,
              productId: Number(productData.id),
              quantity: Number(quantity),
              reason: reason as string,
              solution: solution as string,
            },
          });
          if (res.status === 200) {
            toast({
              title: `Gửi yêu cầu đổi trả thành công.`,
              description: ``,
              action: (
                <ToastAction className="border-none" altText="Try again">
                  <div className="flex gap-2 items-center">
                    <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                      OK
                    </button>
                    <Link
                      href={"/don-hang"}
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
              title: "Gửi yêu cầu không thành công.",
              description: `${res.body ?? "Đã có lỗi xảy ra!"}`,
              action: (
                <ToastAction className="border-none" altText="Try again">
                  <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                    Thử lại
                  </button>
                </ToastAction>
              ),
              className: "bg-white border-rose-500",
            });
          }
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="ten" className="text-gray-800 text-base font-bold">
          Sản phẩm
        </Label>
        <div className="divide-y">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="relative h-16 w-16 rounded-lg">
                <ImageKit
                  path={productData.hinhanh}
                  alt="image"
                  loading="lazy"
                  height={300}
                  width={400}
                  className="md:h-full h-auto w-full object-cover rounded-xl"
                />
              </div>

              <div>
                <h5>{productData.ten}</h5>
                <h6 className=" flex justify-between items-center">
                  Số lượng đã mua | x {productData.soluong}
                </h6>
              </div>
            </div>
            <strong className="md:text-lg text-base font-bold text-rose-500">
              {FormatVND({ amount: productData.gia })}
            </strong>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="quantity" className="text-gray-800 text-base font-bold">
          Số lượng
        </Label>
        <input
          id="quantity"
          name="quantity"
          defaultValue={1}
          type="number"
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
        <span className="text-sm text-rose-500">{error.quantity}</span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reason" className="text-gray-800 text-base font-bold">
          Lý do đổi trả
        </Label>
        <select
          id="reason"
          name="reason"
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        >
          <option value={""}>Lý do đổi trả</option>
          {typeData && typeData.length
            ? typeData.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.ten}
                  </option>
                );
              })
            : null}
        </select>
        <span className="text-sm text-rose-500">{error.reason}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content" className="text-gray-800 text-base font-bold">
          Liệt kê chi tiết lỗi
        </Label>
        <textarea
          id="content"
          name="content"
          rows={4}
          className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Liệt kê chi tiết lỗi, ví dụ: Đèn nhấp nháy, bật không lên..."
        ></textarea>
        <span className="text-sm text-rose-500">{error.content}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image" className="text-gray-800 text-base font-bold">
          Thêm hình ảnh kiện hàng
        </Label>
        <span className="text-gray-500">
          - Hình chụp kiện hàng có thể hiện tem vận chuyển đơn hàng <br />
          - Hình ảnh ngoại quan sản phẩm <br />- Hình ảnh thể hiện lỗi sản phẩm
        </span>
        <div>
          <FilesInput
            imageList={imageList}
            onChangeAddFileInput={handleAddFileInput}
            onChangeFileInput={handleFileInput}
            onChangeRemoveInput={handleRemoveInput}
          />
        </div>
        <span className="text-sm text-rose-500">{error.image}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="solution" className="text-gray-800 text-base font-bold">
          Chọn giải pháp mong muốn
        </Label>
        <select
          id="solution"
          name="solution"
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        >
          <option value={""}>Giải pháp đổi trả</option>
          {solutinData && solutinData.length
            ? solutinData.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.ten}
                  </option>
                );
              })
            : null}
        </select>
        <span className="text-sm text-rose-500">{error.solution}</span>
      </div>
      <p className="text-base  text-gray-700">
        Chính sách đổi trả -{" "}
        <span className="text-blue-500 hover:underline">Xem tại đây</span>
      </p>
      <div className="flex items-center gap-2 justify-between">
        <BackButton type="button" variant={"outline"} className="w-1/2">
          Trở lại
        </BackButton>
        <SubmitButton
          cName="w-1/2 bg-rose-500 hover:bg-rose-400 text-white"
          label="Gửi yêu cầu"
        />
      </div>
    </form>
  );
}

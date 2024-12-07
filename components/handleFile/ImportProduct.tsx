"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { FormatVND } from "@/helpers/utils";
import { FileUp } from "lucide-react";
import { SanPham } from "@/lib/db/types";
import { SubmitButton } from "../submitButton";
import { createMultipleProducts } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";

export default function ImportProduct() {
  const { toast } = useToast();
  const router = useRouter();
  const [fileData, setFileData] = React.useState<SanPham[]>([]);
  const [fileInputKey, setFileInputKey] = React.useState<string>(
    Date.now().toString()
  ); // Dùng để reset input file
  const [err, setErr] = React.useState("");
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: SanPham[] = XLSX.utils.sheet_to_json(worksheet);

      // Cập nhật state với dữ liệu từ file
      setFileData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };
  function handleRemoveProduct(id: number) {
    setFileData(fileData.filter((item) => item.id !== id));
  }
  const handleFileClear = () => {
    setFileData([]); // Xóa dữ liệu trong bảng
    setFileInputKey(Date.now().toString()); // Reset input file bằng cách thay đổi key
    setErr("");
  };

  const actionCreate = createMultipleProducts.bind(null);

  return (
    <div>
      {/* Button mở dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="text-base h-full hover:bg-indigo-200 bg-white text-indigo-600 rounded-md border border-indigo-600  hover:text-indigo-600">
            <FileUp className="w-5 h-5 mr-3" />
            Nhập sản phẩm
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%] bg-white gap-2 transition-all duration-75">
          <DialogHeader>
            <DialogTitle>Nhập sản phẩm từ file</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <input
              key={fileInputKey} // Reset input file bằng cách thay đổi key
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600"
            />
            <span className="text-gray-600 text-sm">
              Vui lòng tải file thuộc định dạng xlsx hoặc csv
            </span>
          </div>

          {/* Table hiển thị dữ liệu */}
          <div className="flex justify-end">
            <Button onClick={handleFileClear}>Làm mới</Button>
          </div>
          <div className="mt-6 overflow-x-auto max-h-[50vh]">
            {fileData.length ? (
              <table className="text-left w-full whitespace-nowrap">
                <thead className="bg-gray-200 text-gray-700">
                  <tr className="border-b border-gray-300">
                    <th className="px-6 py-3">STT</th>
                    <th className="px-6 py-3">Tên sản phẩm</th>
                    <th className="px-6 py-3">Danh Muc ID</th>
                    <th className="px-6 py-3">Xuất Xứ ID</th>
                    <th className="px-6 py-3">Thương hiệu</th>
                    <th className="px-6 py-3">Giá</th>
                    <th className="px-6 py-3">Mô tả</th>
                    <th className="px-6 py-3">Khối lượng</th>
                    <th className="px-6 py-3">Kích thước</th>
                    <th className="px-6 py-3">Hình ảnh</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="list">
                  {fileData.map((item: SanPham) => (
                    <tr key={item.id} className="border-b border-gray-300">
                      <td className="product_name px-6 py-3">{item.id}</td>
                      <td className="product_name px-6 py-3">{item.ten}</td>
                      <td className="product_name px-6 py-3">
                        {item.danhmuc_id}
                      </td>
                      <td className="product_name px-6 py-3">
                        {item.xuatxu_id}
                      </td>
                      <td className="product_name px-6 py-3">
                        {item.thuonghieu}
                      </td>
                      <td className="text-rose-500 font-bold px-6 py-3">
                        {FormatVND({ amount: item.gia })}
                      </td>
                      <td className="category_name px-6 py-3">{item.mota}</td>
                      <td className="category_name px-6 py-3">
                        {item.khoiluong}
                      </td>
                      <td className="category_name px-6 py-3">
                        {item.kichthuoc}
                      </td>
                      <td className="added_data px-6 py-3">{item.hinhanh}</td>

                      <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            item.id && handleRemoveProduct(item.id)
                          }
                          className="group  rounded-md py-1.5 px-3  hover:text-rose-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>

          <span className="text-sm py-2 text-rose-500">{err}</span>
          <div className="flex justify-end">
            <form
              action={async () => {
                if (fileData.length) {
                  const res = await actionCreate({ data: fileData });
                  if (res.status === 200) {
                    toast({
                      title: `Thêm thành công`,
                      description: ``,
                      action: (
                        <ToastAction
                          className="border-none"
                          altText="Try again"
                        >
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => router.refresh()}
                              className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
                            >
                              Xem
                            </button>
                          </div>
                        </ToastAction>
                      ),
                      className: "bg-white border-green-500",
                    });
                    handleFileClear();
                  } else {
                    setErr(res.body);
                  }
                }
              }}
            >
              <SubmitButton cName="text-white" label={"Thêm Tất Cả"} />
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

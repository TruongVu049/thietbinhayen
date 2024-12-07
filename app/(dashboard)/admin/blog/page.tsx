"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { deletePost, getAllBlogs } from "@/lib/db";
import { BaiViet } from "@/lib/db/types";
import ImageKit from "@/components/imagekit";
import { FormatDate } from "@/helpers/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submitButton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
export default function BlogsPage() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<BaiViet[]>([]);
  const blogRef = useRef<BaiViet | null>(null);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const actionDelete = deletePost.bind(null);
  useEffect(() => {
    async function fetchEmployees() {
      const data = await getAllBlogs();
      setBlogs(data);
    }
    fetchEmployees();
  }, []);
  const handleRemoveBlog = (id: number) => {
    setBlogs((prev) => prev.filter((emp) => emp.id !== id));
  };

  return (
    <div className="bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Bài viết
        </h1>
      </div>
      <div className="grid grid-cols-1 ">
        <div className="btn-toolbar border-b border-gray-300 px-5 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-3">
          <div></div>
          <Link href="/admin/blog/handle">
            <button className="inline-flex px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md ml-6">
              Thêm bài viết
            </button>
          </Link>
        </div>
        <div className="bg-white rounded-lg">
          <div className="btn-toolbar border-b border-gray-300 px-5 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-3"></div>
          <div className="relative overflow-x-auto">
            <table className="text-left w-full whitespace-nowrap">
              <thead className="bg-gray-200 text-gray-700">
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-3">Bài viết</th>
                  <th className="px-6 py-3">Tiêu đề</th>
                  <th className="px-6 py-3">Lượt xem</th>
                  <th className="px-6 py-3">Lượt thích</th>
                  <th className="px-6 py-3">Ngày tạo</th>
                  <th className="px-6 py-3">Ngày cập nhật</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {blogs.length
                  ? blogs.map((item) => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="px-6 py-3 flex items-center gap-2">
                          <span className="ml-3">{item.id}</span>
                          <div className="relative h-6 w-6 rounded-lg">
                            <ImageKit
                              path={item.hinhanh}
                              alt="image"
                              loading="lazy"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3">{item.tieude}</td>
                        <td className="px-6 py-3">{item.luotxem}</td>
                        <td className="px-6 py-3">{item.luotthich}</td>
                        <td className="px-6 py-3">
                          {item.ngaytao
                            ? FormatDate({ isoDate: item.ngaytao })
                            : "---"}
                        </td>
                        <td className="px-6 py-3">
                          {item.ngaycapnhat
                            ? FormatDate({ isoDate: item.ngaycapnhat })
                            : "---"}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`${
                              item.trangthai ? "bg-green-200" : "bg-rose-200"
                            } px-2 py-1 rounded-md text-sm font-medium`}
                          >
                            {item.trangthai ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="px-6 py-3 flex items-center gap-1">
                          <Link
                            href={`/admin/blog/handle/${item.slug}`}
                            className="group py-1.5 px-3 rounded-md hover:text-indigo-500 hover:bg-gray-100 hover:underline"
                          >
                            Xem chi tiết
                          </Link>

                          <button
                            type="button"
                            className="group   rounded-md py-1.5 px-3  hover:text-rose-500 hover:bg-gray-50 hover:underline"
                            onClick={() => {
                              blogRef.current = item;
                              setOpenRemoveModal(true);
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  : new Array(4).fill(1).map((item: number, index: number) => (
                      <tr
                        key={index}
                        className="animate-pulse border-b h-full "
                      >
                        <td
                          colSpan={8}
                          className=" w-full h-6 m-2 bg-gray-200  "
                        ></td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={openRemoveModal} onOpenChange={setOpenRemoveModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[525px] bg-white">
          <DialogHeader>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa không
            </DialogDescription>
          </DialogHeader>
          <form
            action={async () => {
              if (blogRef.current) {
                const res = await actionDelete({ id: blogRef.current?.id });

                if (res.status === 200) {
                  toast({
                    title: `Xóa bài viết thành công.`,
                    description: ``,
                    action: (
                      <ToastAction className="border-none" altText="Try again">
                        <div className="flex gap-2 items-center">
                          <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                            OK
                          </button>
                        </div>
                      </ToastAction>
                    ),
                    className: "bg-white border-green-500",
                  });
                  res.body.id && handleRemoveBlog(res.body?.id);
                  setOpenRemoveModal(false);
                } else {
                  toast({
                    title: `Xóa bài viết không thành công.`,
                    description: `${res.body ?? ""}`,
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
            className={`grid items-start gap-4 `}
          >
            <div className="flex items-center gap-2 justify-between">
              <Button
                onClick={() => setOpenRemoveModal(false)}
                type="button"
                variant={"outline"}
                className="w-1/2"
              >
                Hủy
              </Button>
              <SubmitButton label={"Xác nhận"} cName="w-1/2" />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

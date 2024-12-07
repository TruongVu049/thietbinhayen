"use client";

import Editor from "@/components/Editor";

import { SubmitButton } from "@/components/submitButton";
import { ToastAction } from "@/components/ui/toast";
import Upload from "@/components/upload";
import { useToast } from "@/hooks/use-toast";
import { createPost, updatePost } from "@/lib/db";
import { BaiViet } from "@/lib/db/types";
import { FileInput } from "@/lib/types";
import Link from "next/link";
import { Suspense, useState } from "react";

export default function BlogForm({ blog }: { blog: BaiViet | null }) {
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [image, setImage] = useState<FileInput | null>(
    blog ? { id: -1, url: blog?.hinhanh } : null
  );
  const [content, setContent] = useState(blog ? blog.noidung : "");

  const actionCreate = createPost.bind(null);
  //handle image
  function handleImage(url: string) {
    setImage({
      id: Date.now(),
      url: url,
    });
  }
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return (
    <form
      className="sm:p-4 p-2 bg-white rounded-md"
      action={async (formData: FormData) => {
        let isValid = true;
        const title = formData.get("tieude")?.toString() ?? "";
        if (title === "") {
          isValid = false;
          setError("Vui lòng nhập vào tiêu đề");
        } else if (title.length > 255) {
          isValid = false;
          setError("Tui đề quá dài. Vui lòng thay đổi!");
        }
        if (!image?.id || !image.url) {
          isValid = false;
          setError("Vui lòng thêm hình ảnh!");
        }
        if (content === "" || content.length < 155) {
          isValid = false;
          setError("Vui lòng bổ sung nội dung!");
        }
        if (isValid) {
          setError("");
          const status = formData.get("trangthai")?.toString() ?? "";

          const data: BaiViet = {
            id: blog?.id ?? 0,
            tieude: title,
            noidung: content,
            hinhanh: image?.url ?? "",
            slug: slugify(title),
            trangthai: status === "public" ? true : false,
          };
          const res = blog
            ? await updatePost({ id: blog.id, data: data })
            : await actionCreate({ data });

          if (res.status === 200) {
            toast({
              title: `${blog ? "Cập nhật" : "Thêm"} bài viết thành công.`,
              description: ``,
              action: (
                <ToastAction className="border-none" altText="Try again">
                  <div className="flex gap-2 items-center">
                    {!blog && (
                      <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                        Thêm mới
                      </button>
                    )}
                    <Link
                      href={"/admin/blog"}
                      className="bg-green-500 text-white inline-flex h-8 shrink-0 items-center justify-center rounded-md border  px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
                    >
                      Xem
                    </Link>
                  </div>
                </ToastAction>
              ),
              className: "bg-white border-green-500",
            });
          } else {
            setError(res.body ?? "");
          }
        }
      }}
    >
      <div className="mb-5">
        <label
          htmlFor="ten"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Tiêu đề
        </label>
        <input
          id="tieude"
          type="text"
          defaultValue={blog ? blog.tieude : ""}
          name="tieude"
          required
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="hinhanh"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Hình ảnh
        </label>
        <span className="inline-block border border-indigo-500 p-3 rounded-lg">
          <Upload uploadedFilePath={image} onUploadedFilePath={handleImage} />
        </span>
      </div>
      <div className="mb-5">
        <label
          htmlFor="thongsokythuat"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Nội dung
        </label>
        <Suspense>
          <Editor description={content} onChangeDescription={setContent} />
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
              type="checkbox"
              defaultChecked={blog && blog.trangthai ? blog.trangthai : false}
              name="trangthai"
              value={"public"}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </span>
      </div>
      {error && <p className="md:text-base text-sm text-rose-500">{error}</p>}
      <div className="flex justify-end">
        <SubmitButton
          label={blog ? "Cập nhật bài viết" : "Tạo bài viết"}
          cName="w-1/4"
        />
      </div>
    </form>
  );
}

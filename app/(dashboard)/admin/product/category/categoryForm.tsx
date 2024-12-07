import { Button } from "@/components/ui/button";
import { DanhMuc } from "@/lib/db/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createCategory, updateCategory } from "@/lib/db";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { SubmitButton } from "@/components/submitButton";

export default function CategoryForm({
  categoryList,
  onSetCategoryList,
  onUpdateCategoryList,
}: {
  categoryList: DanhMuc[];
  onSetCategoryList: (category: DanhMuc) => void;
  onUpdateCategoryList: (category: DanhMuc) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const screenRef = useRef<DanhMuc | null>(null);

  const actionWithVariant = createCategory.bind(null);
  const actionUpdate = updateCategory.bind(null);

  const typeStr = screenRef.current ? "Cập nhật" : "Thêm";
  function handleCloseDialog() {
    setOpen(false);
  }

  return (
    <div className="p-4 rounded-xl shadow-md border bg-white">
      <div className="flex items-center justify-between">
        <h4 className="md:text-lg text-base font-bold">Danh mục</h4>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              onClick={() => (screenRef.current = null)}
              className="bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
            >
              Thêm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-white">
            <DialogHeader>
              <DialogTitle>
                {screenRef.current ? "Cập nhật" : "Thêm mới"}
              </DialogTitle>
            </DialogHeader>
            <form
              action={async (formData: FormData) => {
                const res = !screenRef.current
                  ? await actionWithVariant(formData)
                  : await actionUpdate(formData);
                if (res.status === 200) {
                  !screenRef.current
                    ? onSetCategoryList(res?.body?.danhmuc as DanhMuc)
                    : onUpdateCategoryList(res?.body?.danhmuc as DanhMuc);
                  toast({
                    title: `${typeStr} danh mục thành công.`,
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
                  handleCloseDialog();
                } else {
                  toast({
                    title: `${typeStr} danh mục không thành công.`,
                    description: `Vui lòng thực hiện lại!`,
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
              }}
              className={`grid items-start gap-4`}
            >
              <Input
                type="text"
                id="id"
                name="id"
                className="sr-only"
                defaultValue={screenRef.current?.id ?? 0}
                style={{ display: "none" }}
              />
              <div className="grid gap-2">
                <Label htmlFor="ten">Tên</Label>
                <Input
                  type="text"
                  id="ten"
                  name="ten"
                  defaultValue={screenRef.current?.ten ?? ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duongdan">Trạng thái</Label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="trangthai"
                    defaultChecked={screenRef.current?.trangthai}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                </label>
              </div>
              <SubmitButton label={screenRef.current ? "Cập nhật" : "Lưu"} />
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative overflow-x-auto mt-4">
        <table className="text-left w-full whitespace-nowrap">
          <thead className="bg-gray-200 text-gray-700">
            <tr className="border-b border-gray-300">
              <th className="listjs-sorter px-6 py-3" data-sort="product_name">
                ID
              </th>
              <th className="listjs-sorter px-6 py-3" data-sort="category_name">
                Tên
              </th>
              <th className="listjs-sorter px-6 py-3" data-sort="added_data">
                Trạng thái
              </th>
              <th
                className="listjs-sorter px-6 py-3"
                data-sort="action_info"
              ></th>
            </tr>
          </thead>
          <tbody className="list">
            {categoryList.length
              ? categoryList.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className=" px-6 py-3">{item.id}</td>
                    <td className=" px-6 py-3">{item.ten}</td>
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
                      <Button
                        onClick={() => {
                          screenRef.current = {
                            id: item.id,
                            ten: item.ten,
                            mota: "",
                            trangthai: item.trangthai,
                          };
                          setOpen(true);
                        }}
                        variant={"outline"}
                        className="border-indigo-500"
                      >
                        Sửa
                      </Button>
                    </td>
                  </tr>
                ))
              : new Array(4).fill(1).map((item: number, index: number) => (
                  <tr key={index} className="animate-pulse border-b h-full ">
                    <td
                      colSpan={7}
                      className=" w-full h-12 m-2 bg-gray-100  "
                    ></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

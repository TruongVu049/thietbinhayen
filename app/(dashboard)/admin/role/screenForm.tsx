import { Button } from "@/components/ui/button";
import { ManHinh } from "@/lib/db/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createScreen, deleteScreen, updateScreen } from "@/lib/db";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { SubmitButton } from "@/components/submitButton";

export default function ScreenForm({
  screens,
  onSetScreens,
  onUpdateScreens,
  onDeleteScreens,
}: {
  screens: ManHinh[];
  onSetScreens: (screen: ManHinh) => void;
  onUpdateScreens: (screen: ManHinh) => void;
  onDeleteScreens: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const screenRef = useRef<ManHinh | null>(null);
  const idRemoveRef = useRef<number | null>(null);

  const actionWithVariant = createScreen.bind(null);
  const actionUpdate = updateScreen.bind(null);
  const actionDelete = deleteScreen.bind(null);

  const typeStr = screenRef.current ? "Cập nhật" : "Thêm";
  function handleCloseDialog() {
    setOpen(false);
  }

  return (
    <div className="p-4 rounded-xl shadow-md border bg-white">
      <div className="flex items-center justify-between">
        <h4 className="md:text-lg text-base font-bold">Màn hình</h4>
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
                    ? onSetScreens(res?.body?.manhinh as ManHinh)
                    : onUpdateScreens(res?.body?.manhinh as ManHinh);
                  toast({
                    title: `${typeStr} màn hình thành công.`,
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
                    title: `${typeStr} màn hình không thành công.`,
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
                <Label htmlFor="duongdan">Đường dẫn</Label>
                <Input
                  id="duongdan"
                  name="duongdan"
                  defaultValue={screenRef.current?.duongdan ?? ""}
                />
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
                Đường dẫn
              </th>
              <th
                className="listjs-sorter px-6 py-3"
                data-sort="action_info"
              ></th>
            </tr>
          </thead>
          <tbody className="list">
            {screens.length
              ? screens.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className=" px-6 py-3">{item.id}</td>
                    <td className=" px-6 py-3">{item.ten}</td>
                    <td className=" px-6 py-3">{item.duongdan}</td>
                    <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                      <Button
                        onClick={() => {
                          screenRef.current = {
                            id: item.id,
                            ten: item.ten,
                            duongdan: item.duongdan,
                          };
                          setOpen(true);
                        }}
                        variant={"outline"}
                        className="border-indigo-500"
                      >
                        Sửa
                      </Button>
                      <Button
                        onClick={() => {
                          idRemoveRef.current = item.id;
                          setOpenRemoveModal(true);
                        }}
                        variant={"outline"}
                        className="border-rose-500"
                      >
                        Xóa
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
              const formData = new FormData();
              formData.append("id", String(idRemoveRef.current));
              const res = await actionDelete(formData);
              if (res.status === 200) {
                onDeleteScreens(res.body?.id ?? 0);
                toast({
                  title: `Xóa màn hình thành công.`,
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
                setOpenRemoveModal(false);
              } else {
                toast({
                  title: `Xóa màn hình không thành công.`,
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
              <SubmitButton label={"Xác nhận"} />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

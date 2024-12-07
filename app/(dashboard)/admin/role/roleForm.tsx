import { Button } from "@/components/ui/button";
import { ManHinh, PhanQuyen, PhanQuyenManHinh } from "@/lib/db/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { createRole, deleteRole, updateRole, updateRoleScreen } from "@/lib/db";
import { SubmitButton } from "@/components/submitButton";
import { Settings, MonitorDot } from "lucide-react";

export default function ScreenForm({
  roles,
  onSetRoles,
  onUpdateRoles,
  onDeleteRoles,
  screens,
}: {
  screens: ManHinh[];
  roles: PhanQuyen[];
  onSetRoles: (role: PhanQuyen) => void;
  onUpdateRoles: (role: PhanQuyen) => void;
  onDeleteRoles: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [openAuthorityModal, setOpenAuthorityModal] = React.useState(false);

  const [role, setRole] = useState<PhanQuyen | null>(null);

  const roleRef = useRef<PhanQuyen | null>(null);
  const idRemoveRef = useRef<number | null>(null);

  const actionWithVariant = createRole.bind(null);
  const actionUpdate = updateRole.bind(null);
  const actionDelete = deleteRole.bind(null);

  const typeStr = roleRef.current ? "Cập nhật" : "Thêm";
  function handleCloseDialog() {
    setOpen(false);
  }

  function handleCloseAuthorityModal() {
    setOpenAuthorityModal(false);
  }

  return (
    <div className="p-4 rounded-xl shadow-md border bg-white">
      <div className="flex items-center justify-between">
        <h4 className="md:text-lg text-base font-bold">Chức vụ</h4>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              onClick={() => (roleRef.current = null)}
              className="bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
            >
              Thêm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-white">
            <DialogHeader>
              <DialogTitle>
                {roleRef.current ? "Cập nhật" : "Thêm mới"}
              </DialogTitle>
            </DialogHeader>
            <form
              action={async (formData: FormData) => {
                const res = !roleRef.current
                  ? await actionWithVariant(formData)
                  : await actionUpdate(formData);
                if (res.status === 200) {
                  !roleRef.current
                    ? onSetRoles(res?.body?.phanquyen as PhanQuyen)
                    : onUpdateRoles(res?.body?.phanquyen as PhanQuyen);
                  toast({
                    title: `${typeStr} chức vụ thành công.`,
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
                    title: `${typeStr} chức vụ không thành công.`,
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
                defaultValue={roleRef.current?.id ?? 0}
                style={{ display: "none" }}
              />
              <div className="grid gap-2">
                <Label htmlFor="ten">Tên</Label>
                <Input
                  type="text"
                  id="ten"
                  name="ten"
                  defaultValue={roleRef.current?.ten ?? ""}
                />
              </div>
              <SubmitButton label={roleRef.current ? "Cập nhật" : "Lưu"} />
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
              <th className="listjs-sorter px-6 py-3" data-sort="category_name">
                Quyền truy cập
              </th>
              <th
                className="listjs-sorter px-6 py-3"
                data-sort="action_info"
              ></th>
            </tr>
          </thead>
          <tbody className="list">
            {roles.length
              ? roles.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className=" px-6 py-3">{item.id}</td>
                    <td className=" px-6 py-3">{item.ten}</td>
                    <td className=" px-6 py-3">
                      <Button
                        onClick={() => {
                          setRole({
                            id: item.id,
                            ten: item.ten,
                          });
                          setOpenAuthorityModal(true);
                        }}
                        variant={"outline"}
                        className="border-green-500 flex items-center gap-2"
                      >
                        <Settings className="w-5 h-5 text-gray-800" />
                        Xem
                      </Button>
                    </td>
                    <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                      <Button
                        onClick={() => {
                          roleRef.current = {
                            id: item.id,
                            ten: item.ten,
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
                      colSpan={4}
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
                onDeleteRoles(res.body?.id ?? 0);
                toast({
                  title: `Xóa chức vụ thành công.`,
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
                  title: `Xóa chức vụ không thành công.`,
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

      <Dialog open={openAuthorityModal} onOpenChange={setOpenAuthorityModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Quyền truy cập</DialogTitle>
          </DialogHeader>
          <AuthorityForm
            role={role}
            screens={screens}
            onCloseAuthorityModal={handleCloseAuthorityModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AuthorityForm({
  role,
  screens,
  onCloseAuthorityModal,
}: {
  role: PhanQuyen | null;
  screens: ManHinh[];
  onCloseAuthorityModal: () => void;
}) {
  const [dataRole, setDataRole] = useState<PhanQuyenManHinh[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const actionUpdateRoleScreen = updateRoleScreen.bind(null);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/PhanQuyens/${role?.id}`
      );
      const data = await res.json();
      setDataRole(data);
      setIsLoading(false);
    }

    fetchPosts();
  }, [role?.id]);
  return (
    <form
      action={async (formData: FormData) => {
        const res = await actionUpdateRoleScreen(formData);
        if (res.status === 200) {
          toast({
            title: `Cập nhật quyền truy cập thành công.`,
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
          onCloseAuthorityModal();
        } else {
          toast({
            title: `Cập nhật quyền truy cập không thành công.`,
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
        defaultValue={role?.id ?? 0}
        style={{ display: "none" }}
      />
      <div className="grid gap-2">
        <Label htmlFor="ten">Chức vụ</Label>
        <span className="md:text-base text-sm font-bold">{role?.ten}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ten">Quyền truy cập</Label>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4 items-center">
          {isLoading
            ? new Array(4).fill(4).map((item: number, index: number) => (
                <div key={index} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg border p-3"></div>
                </div>
              ))
            : screens.length
            ? screens.map((item) => {
                const selectedItem = dataRole.find(
                  (r) => r.manhinh_id === item.id && r.phanquyen_id === role?.id
                );
                return (
                  <div
                    key={item.id}
                    className={`${
                      selectedItem ? "bg-blue-50 border-blue-500" : ""
                    } flex items-center flex-col gap-1 text-gray-800 rounded-lg border p-3`}
                  >
                    <MonitorDot className="w-10 h-10 text-gray-600" />
                    <h6 className="md:text-base text-sm">{item.ten}</h6>
                    <input
                      type="checkbox"
                      className="accent-indigo-500 w-6 h-6"
                      name="screens"
                      defaultValue={item.id}
                      defaultChecked={selectedItem ? true : false}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={onCloseAuthorityModal}
          type="button"
          variant={"outline"}
          className="w-1/2"
        >
          Hủy
        </Button>
        <SubmitButton cName="w-1/2" label={"Lưu"} />
      </div>
    </form>
  );
}

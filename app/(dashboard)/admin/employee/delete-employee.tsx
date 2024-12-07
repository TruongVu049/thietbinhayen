"use client";

import { removeEmployee } from "@/lib/db";
import { AlertDialogContainer } from "@/components/AlertDialogContainer";
import { useRef } from "react";

export function DeleteEmployee({
  empId,
  onRemove,
}: {
  empId: number;
  onRemove: (id: number) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleDelete = async () => {
    try {
      const res = await removeEmployee({ id: empId });
      if (res.status === 200) {
        onRemove(empId);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <form ref={formRef}>
      <AlertDialogContainer
        triggerElement={
          <button
            type="button"
            className="group  rounded-md py-1.5 px-3  hover:text-rose-500 hover:underline"
          >
            Xóa
          </button>
        }
        title="Thông báo"
        desc="Bạn có chắc chắn muốn xóa không?"
        cName="bg-white"
        actionCancel="Hủy"
        actionSubmit="Xác nhận"
        onAction={handleDelete}
      />
    </form>
  );
}

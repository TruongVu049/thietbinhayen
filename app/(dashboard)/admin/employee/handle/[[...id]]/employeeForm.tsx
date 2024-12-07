"use client";
import { NhanVien, PhanQuyen } from "@/lib/db/types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, EmployeeFormData } from "@/schemas";
import { Loader2 } from "lucide-react";
import { createEmployee, updateEmployee } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";

export default function EmployeeForm({
  phanquyens,
  employee,
}: {
  phanquyens: PhanQuyen[];
  employee: NhanVien | null;
}) {
  const { toast } = useToast();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema(!!employee)),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<EmployeeFormData> = async (data) => {
    setIsLoading(true);

    try {
      const res = employee
        ? await updateEmployee({
            id: employee.id,
            data: data,
          })
        : await createEmployee({
            data: data,
          });

      if (res.status === 200) {
        toast({
          title: `${employee ? "Cập nhật" : "Thêm"} nhân viên thành công.`,
          description: `Chọn vào xem để xem nhân viên đã được ${
            employee ? "cập nhật" : "thêm"
          }`,
          action: (
            <ToastAction className="border-none" altText="Try again">
              <div className="flex gap-2 items-center">
                {!employee && (
                  <button
                    onClick={() => reset()}
                    className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
                  >
                    Thêm mới
                  </button>
                )}
                <Link
                  href={"/admin/employee"}
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
        toast({
          title: `${
            employee ? "Cập nhật" : "Thêm"
          } nhân viên không thành công.`,
          description: res.body ?? "Đã có lỗi xảy ra. Vui lòng thực hiện lại.",
          action: (
            <ToastAction className="border-none" altText="Try again">
              <button
                onClick={() => reset()}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
              >
                Thử lại
              </button>
            </ToastAction>
          ),
          className: "bg-white border-rose-500",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
      toast({
        title: "Thêm nhân viên không thành công.",
        description: errorMessage,
        action: (
          <ToastAction className="border-none" altText="Try again">
            <button
              onClick={() => reset()}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
            >
              Thử lại
            </button>
          </ToastAction>
        ),
        className: "bg-white border-rose-500",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          Họ tên
        </label>
        <input
          {...register("hoten")} // Liên kết input email với react-hook-form
          defaultValue={employee?.hoten ?? ""}
          disabled={isLoading}
          id="hoten"
          type="text"
          required
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
        {errors.hoten && (
          <p className="md:text-base text-sm text-rose-500">
            {errors.hoten.message}
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
              Email
            </label>
            <input
              {...register("email")} // Liên kết input email với react-hook-form
              disabled={isLoading}
              defaultValue={employee?.email ?? ""}
              id="email"
              type="email"
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.email && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="phanquyen_id"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Chức vụ
            </label>
            <select
              {...register("phanquyen_id")} // Liên kết input email với react-hook-form
              defaultValue={employee?.phanquyen_id ?? ""}
              disabled={isLoading}
              id="phanquyen_id"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            >
              {phanquyens?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.ten}
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
              htmlFor="gia"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Mật khẩu
            </label>
            <input
              {...register("password")}
              disabled={isLoading}
              id="password"
              type="password"
              placeholder={
                employee ? "Nhập vào mật khẩu mới nếu muốn thay đổi" : ""
              }
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.password && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="gia"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Xác nhận mật khẩu
            </label>
            <input
              {...register("confirmPassword")}
              disabled={isLoading}
              id="confirmPassword"
              type="password"
              placeholder={
                employee ? "Xác nhận mật khẩu mới nếu muốn thay đổi" : ""
              }
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.confirmPassword && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

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
          {employee ? "Cập nhật" : "Thêm"}
        </button>
      </div>
    </form>
  );
}

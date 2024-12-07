"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { registerAction } from "@/actions/register";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsLoading(true);
    registerAction(data).then((res) => {
      if (res.error) {
        setError(res.error);
        setSuccess("");
        setIsLoading(false);
      }
      if (res.success) {
        setError("");
        setSuccess(res.success);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Đăng ký</h1>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Label htmlFor="fullname">Họ tên</Label>
          <Input type="text" {...register("fullName")} />
          {errors.fullName && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="m@gmail.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>

          <Input type="password" {...register("password")} />
          {errors.password && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {error !== "" && isLoading === false && (
          <p className="md:text-base text-sm text-rose-500">{error}</p>
        )}
        {success !== "" && isLoading === false && (
          <p className="md:text-base text-sm text-green-500">{success}</p>
        )}
        <Button disabled={isLoading} className={"w-full"} type="submit">
          <Loader2
            className={`mr-2 h-4 w-4 animate-spin ${!isLoading && "hidden"}`}
          />
          Đăng ký
        </Button>
      </form>
      <div className=" text-center text-sm">
        Bạn đã có tài khoản?{" "}
        <Link href="/signIn" className="underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

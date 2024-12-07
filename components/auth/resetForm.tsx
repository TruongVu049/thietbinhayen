"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { resetPasswordSchema } from "@/schemas";
import { ResetAction } from "@/actions/reset";

type ResetFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<ResetFormData> = async (data) => {
    setIsLoading(true);
    ResetAction(data).then((res) => {
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
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        className="sr-only"
        type="text"
        {...register("email")}
        value={email}
      />
      <Input
        className="sr-only"
        type="text"
        {...register("token")}
        value={token || ""}
      />
      <div className={!token ? "block" : "hidden"}>
        <Label htmlFor="oldPassword">Mật khẩu củ</Label>
        <Input
          className={token ? "sr-only" : ""}
          type="password"
          placeholder="*****"
          defaultValue={"Test1234##$$"}
          {...register("oldPassword")}
        />
        {errors.oldPassword && !token && (
          <p className="md:text-base text-sm text-rose-500">
            {errors.oldPassword.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Mật khẩu mới</Label>

        <Input type="password" {...register("password")} placeholder="*****" />
        {errors.password && (
          <p className="md:text-base text-sm text-rose-500">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
        <Input
          type="password"
          {...register("confirmPassword")}
          placeholder="*****"
        />
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
        Đổi mật khẩu
      </Button>
    </form>
  );
}

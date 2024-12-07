"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { forgotPasswordSchema } from "@/schemas";
import { forgotAction } from "@/actions/reset";

export default function ForgotForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      forgotAction(values)
        .then((data) => {
          if (data?.error) {
            setError(data?.error);
          }
          if (data?.success) {
            setSuccess(data?.success);
          }
        })
        .catch(() => setError("Đã xảy ra lỗi. Vui lòng thực hiện lại"));
    });
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Xác nhận Email</Label>
        <Input
          {...form.register("email")} // Liên kết input email với react-hook-form
          disabled={isPending}
          id="email"
          type="email"
          placeholder="m@gmail.com"
          required
        />
      </div>
      {/* Hiển thị lỗi nếu có */}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}

      <Button disabled={isPending} type="submit" className="w-full">
        <Loader2
          className={`mr-2 h-4 w-4 animate-spin ${!isPending && "hidden"}`}
        />
        Gửi mã xác nhận
      </Button>
    </form>
  );
}

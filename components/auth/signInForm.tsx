"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas";
import * as z from "zod";
import { signInWithCredentials } from "@/actions/signIn";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SignInForm() {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    setError("");
    startTransition(() => {
      signInWithCredentials(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data?.error);
          }

          if (data?.success) {
            form.reset();
          }
        })
        .catch(() => setError("Đã xảy ra lỗi. Vui lòng thực hiện lại"));
    });
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          {...form.register("email")} // Liên kết input email với react-hook-form
          disabled={isPending}
          id="email"
          type="email"
          placeholder="m@gmail.com"
          required
          tabIndex={1}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Mật khẩu</Label>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline hover:text-rose-500"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <Input
          {...form.register("password")} // Liên kết input password với react-hook-form
          disabled={isPending}
          id="password"
          type="password"
          placeholder="******"
          tabIndex={2}
        />
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button disabled={isPending} type="submit" className="w-full">
        <Loader2
          className={`mr-2 h-4 w-4 animate-spin ${!isPending && "hidden"}`}
        />
        Đăng nhập
      </Button>
    </form>
  );
}

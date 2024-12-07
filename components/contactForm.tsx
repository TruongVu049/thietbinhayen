"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { contactSchema } from "@/schemas";
import { Textarea } from "./ui/textarea";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { sendContact } from "@/lib/db";

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const { register, handleSubmit } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsLoading(true);
    sendContact(data).then((res) => {
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
      <div className="grid gap-2">
        <Label htmlFor="fullname">Họ tên</Label>
        <Input
          {...register("fullName")} // Liên kết input email với react-hook-form
          disabled={isLoading}
          id="fullName"
          type="text"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")} // Liên kết input email với react-hook-form
          disabled={isLoading}
          id="email"
          type="email"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          {...register("phone")} // Liên kết input email với react-hook-form
          disabled={isLoading}
          id="phone"
          type="text"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content">Nội dung</Label>
        <Textarea
          id="content"
          required
          {...register("content")}
          disabled={isLoading}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button disabled={isLoading} type="submit" className="w-full">
        <Loader2
          className={`mr-2 h-4 w-4 animate-spin ${!isLoading && "hidden"}`}
        />
        Gửi
      </Button>
      {success && <div className="text-green-500 text-sm">{success}</div>}
    </form>
  );
}

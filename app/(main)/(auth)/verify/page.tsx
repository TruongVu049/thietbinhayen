"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { resendToken } from "@/actions/resendToken";
export default function ConfirmEmail({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { token } = searchParams as { [key: string]: string };

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<string>(token);
  const route = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    newVerification(valueInput)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          setError("");
          route.push("/signIn");
        }
        if (data.error) {
          setError(data.error);
          setSuccess("");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("An unexpected error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleResending() {
    setIsResending(true);
    resendToken(token)
      .then((data) => {
        alert(data.success);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setIsResending(false);
      });
  }

  return (
    <div className="mx-auto grid w-[350px] gap-6 ">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Xác nhận email</h1>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="token">Mã xác nhận</Label>
          <Input
            type="text"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
          />
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
          Xác nhận
        </Button>
        <Button
          onClick={handleResending}
          className={"w-full bg-blue-800"}
          type="button"
          disabled={isResending}
        >
          <Loader2
            className={`mr-2 h-4 w-4 animate-spin ${!isResending && "hidden"}`}
          />
          Gửi lại mã
        </Button>
      </form>
    </div>
  );
}

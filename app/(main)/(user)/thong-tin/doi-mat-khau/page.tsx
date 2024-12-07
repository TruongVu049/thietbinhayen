"use client";
import ResetForm from "@/components/auth/resetForm";
import { SubmitButton } from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { putPasswordReset } from "@/lib/db";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function PasswordResetPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState("");
  const actionCheck = putPasswordReset.bind(null);
  return (
    <div className="border rounded-lg p-3">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Đổi mật khẩu</h1>
        </div>
        {token !== "" ? (
          <div className="animate-in slide-in-from-right-3 ">
            <ResetForm email={session?.user.email} token={token} />
          </div>
        ) : (
          <div>
            <form
              className="grid gap-4"
              action={async (formData: FormData) => {
                const pas = formData.get("password") ?? "";
                const res = await actionCheck(
                  session?.user.email,
                  pas.toString()
                );
                if (res.status === 200) {
                  setToken(res.body.token);
                } else {
                  setError("Đã có lỗi xảy ra. Vui lòng kiểm ra lại mật khẩu!");
                }
              }}
            >
              <div>
                <Label>Mật khẩu cũ</Label>
                <Input
                  required
                  type="password"
                  name="password"
                  placeholder="*****"
                />
                {error !== "" && (
                  <span className="md:text-base text-sm text-rose-500 leading-3">
                    {error}
                  </span>
                )}
              </div>
              <SubmitButton
                label={"Xác nhận"}
                cName="w-1/2"
                bgColor="bg-gray-900"
                bgColorHover="bg-gray-700"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

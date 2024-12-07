"use client";
import { signOut } from "next-auth/react";
import { SubmitButton } from "../submitButton";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
  const router = useRouter();
  return (
    <form
      action={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
      className=""
    >
      <SubmitButton
        label="Đăng xuất"
        bgColor="bg-transparent"
        cName="text-gray-800 text-sm hover:text-rose-500 flex hover items-center font-normal gap-2 p-0 rounded-md"
        bgColorHover="bg-transparent"
      >
        <LogOut className="w-5 h-5" />
      </SubmitButton>
    </form>
  );
}

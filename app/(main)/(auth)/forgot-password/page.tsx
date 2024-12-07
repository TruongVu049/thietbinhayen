import ForgotForm from "@/components/auth/forgotForm";

export default function ResetPage() {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Quên mật khẩu</h1>
      </div>
      <ForgotForm />
    </div>
  );
}

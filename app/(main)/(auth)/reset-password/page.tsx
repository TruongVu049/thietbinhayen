import ResetForm from "@/components/auth/resetForm";
import { auth } from "@/auth";

export default async function ResetPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { token, email } = searchParams as { [key: string]: string };
  const session = await auth();
  if (!token && !session?.user) {
    return null;
  }
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Đổi mật khẩu</h1>
      </div>
      <ResetForm email={email || session?.user?.email || ""} token={token} />
    </div>
  );
}

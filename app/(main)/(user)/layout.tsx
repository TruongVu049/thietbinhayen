import { Toaster } from "@/components/ui/toaster";
import { User } from "lucide-react";
import Link from "next/link";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-screen-xl block mx-auto">
      <div className="md:grid md:grid-cols-6 gap-4 mt-8">
        <div className="col-span-1 p-3 md:block ">
          <div className=" items-center md:flex hidden">
            <User className="w-10 h-10 text-gray-400 border-2 rounded-full p-2 lg:block hidden ml-2 md:ml-0" />
            <h5>Tài khoản</h5>
          </div>
          <ul className=" text-lg md:block flex items-center  flex-wrap justify-center gap-2 font-medium text-gray-700">
            <li className="lg:ml-10 hover:text-blue-500 md:border-none border-b-2 border-blue-500">
              <Link href={"/thong-tin"}>Hồ sơ</Link>
            </li>
            <li className="lg:ml-10 hover:text-blue-500 md:border-none border-b-2 border-blue-500">
              <Link href={"/thong-tin/doi-mat-khau"}>Đổi mật khẩu</Link>
            </li>
            <li className="lg:ml-10 hover:text-blue-500 md:border-none border-b-2 border-blue-500">
              <Link href={"/don-hang"}>Đơn hàng</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-5 col-span-6">
          <div className="bg-white rounded-lg p-3">{children}</div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

import { CircleUser } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { auth } from "@/auth";
import LogoutForm from "../auth/logoutForm";
export default async function DropdownMenuUser() {
  const session = await auth();
  return (
    <>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/thong-tin"}>Thông tin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/don-hang"}>Đơn hàng</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutForm />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="md:block hidden  items-center gap-4">
          <Link
            href={"/signIn"}
            className="py-1.5 px-3 text-muted-foreground rounded-md hover:text-rose-500"
          >
            Đăng nhập
          </Link>
          <Link
            href={"/register"}
            className="py-1.5 px-3 text-muted-foreground rounded-md text-white hover:bg-rose-400 bg-rose-500 border"
          >
            Đăng ký
          </Link>
        </div>
      )}
    </>
  );
}

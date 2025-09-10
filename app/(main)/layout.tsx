import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/layout/navbar";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Image from "next/image";
import Link from "next/link";
import { CartProvider } from "@/components/cart/cart-context";
import { auth } from "@/auth";
import { getCart } from "@/lib/db";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Thiết Bị Nhà Yến Chất Lượng | Giá Tốt - Hayen",
  description:
    "Hayen chuyên cung cấp thiết bị nhà yến chất lượng cao: loa, amply, hệ thống điều khiển, phụ kiện. Sản phẩm bền bỉ, giá tốt, giao hàng toàn quốc.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const cart = await getCart(session?.user.id);
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader />
        <CartProvider cartP={cart} user={session?.user}>
          <Navbar />
          <main className="font-[sans-serif]">{children}</main>
        </CartProvider>
        <div className="transition-transform duration-200 flex flex-col gap-4 fixed right-10 bottom-10 ">
          <ScrollToTopButton />
          <Link
            prefetch={false}
            target="_blank"
            className="md:w-16 w-12 block relative rounded-full cursor-pointer"
            href="http://zaloapp.com/qr/p/c30zexzpr68b"
          >
            <Image
              src={"/static/images/logo-zalo.png"}
              height={100}
              width={100}
              className="h-auto rounded-full overflow-hidden"
              alt="logo-zalo"
            />
            <span className="animate-ping absolute inline-flex top-0 h-full w-full z-10 rounded-full bg-sky-400 opacity-75"></span>
          </Link>
        </div>
      </body>
    </html>
  );
}

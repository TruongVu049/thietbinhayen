import Image from "next/image";
import placeholderImg from "@/public/static/images/placeholder.svg";
import React from "react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full lg:grid  lg:grid-cols-2">
        <div className="flex items-center justify-center lg:py-2 py-12">
          {children}
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src={placeholderImg}
            alt="Image"
            width="100"
            height="100"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { DiaChi } from "@/lib/db/types";
import { Suspense, useState } from "react";
import Address from "@/components/user/address";
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [selectedAddress, setSelectedAddress] = useState<DiaChi | null>(null);
  function handleUpdateSelectedAddress(address: DiaChi) {
    setSelectedAddress(address);
  }
  return (
    <div className="bg-white p-3 rounded-lg border">
      {status === "loading" ? null : (
        <>
          <div className="text-gray-700">
            <h3 className="md:text-lg text-base font-bold">Hồ sơ của tôi</h3>
            <p className="text-base">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
          </div>
          <div className="grid gap-3 my-3">
            <div>
              <h6 className="md:text-lg text-base pl-1 text-gray-800 border-l-4 border-rose-500">
                Họ tên
              </h6>
              <span className="text-base leading-4 ml-2">
                {session?.user.name}
              </span>
            </div>
            <div>
              <h6 className="md:text-lg text-base pl-1 text-gray-800 border-l-4 border-rose-500">
                Email
              </h6>
              <span className="text-base leading-4 ml-2">
                {session?.user.email}
              </span>
            </div>
            <div>
              <div>
                {session?.user.id && (
                  <Suspense>
                    <Address
                      user={session?.user}
                      selectedAddress={selectedAddress}
                      onUpdateSelectedAddress={handleUpdateSelectedAddress}
                    />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

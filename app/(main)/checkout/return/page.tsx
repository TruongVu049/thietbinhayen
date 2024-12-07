import { auth } from "@/auth";
import { orderpayment } from "@/lib/db";
import { CheckCircle, CircleX } from "lucide-react";
import Link from "next/link";

export default async function VnpayReturnPage({
  searchParams,
}: {
  searchParams: {
    orderId: string;
    vnp_Amount?: string;
    vnp_BankCode?: string;
    vnp_BankTranNo?: string;
    vnp_CardType?: string;
    vnp_OrderInfo?: string;
    vnp_PayDate?: string;
    vnp_ResponseCode?: string;
    vnp_TmnCode?: string;
    vnp_TransactionNo?: string;
    vnp_TransactionStatus?: string;
    vnp_TxnRef?: string;
    vnp_SecureHash?: string;
  };
}) {
  const session = await auth();
  const data = {
    orderId: searchParams.orderId,
    vnp_Amount: searchParams.vnp_Amount ?? null,
    vnp_BankCode: searchParams.vnp_BankCode ?? null,
    vnp_BankTranNo: searchParams.vnp_BankTranNo ?? null,
    vnp_CardType: searchParams.vnp_CardType ?? null,
    vnp_OrderInfo: searchParams.vnp_OrderInfo ?? null,
    vnp_PayDate: searchParams.vnp_PayDate ?? null,
    vnp_ResponseCode: searchParams.vnp_ResponseCode ?? null,
    vnp_TmnCode: searchParams.vnp_TmnCode ?? null,
    vnp_TransactionNo: searchParams.vnp_TransactionNo ?? null,
    vnp_TransactionStatus: searchParams.vnp_TransactionStatus ?? null,
    vnp_TxnRef: searchParams.vnp_TxnRef ?? null,
    vnp_SecureHash: searchParams.vnp_SecureHash ?? null,
  };
  const url = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (key !== "orderId" && key !== "vnp_SecureHash") {
      url.append(key, value as string);
    }
  }
  const res = await orderpayment({
    OrderId: data.orderId,
    VnpResponseCode: data.vnp_ResponseCode ?? "",
    VnpTransactionStatus: data.vnp_TransactionStatus ?? "",
    VnpTxnRef: data.vnp_TxnRef ?? "",
    hashData: url.toString(),
    VnpSecureHash: data.vnp_SecureHash ?? "",
    VnpPayDate: data.vnp_PayDate ?? "",
  });

  console.log("res", res);

  return (
    <main className="max-w-screen-xl block mx-auto ">
      <div className="w-full flex items-center justify-center ">
        <div className="max-w-lg w-[400px] md:mt-32 mt-24 flex flex-col gap-3 text-center justify-center items-center bg-white border-gray-100 border-4 rounded-lg shadow-md p-4">
          {res.status === 200 ? (
            <CheckCircle className="md:w-24 md:h-24 h-12 w-12 text-green-500" />
          ) : (
            <CircleX className="md:w-24 md:h-24 h-12 w-12 text-rose-500" />
          )}
          <p className="md:text-lg text-base">
            {res.status === 200
              ? "Chúc mừng bạn đã đặt hàng thành công."
              : res.body}
          </p>
          <div className="w-full flex items-center justify-between gap-4 md:flex-nowrap flex-wrap">
            <Link
              href={"/search"}
              className="w-full px-4 py-2 rounded-md border border-gray-800 text-gray-800"
            >
              {res.status === 200 ? "Mua thêm" : "Mua lại"}
            </Link>
            <Link
              href={"/don-hang"}
              className="w-full px-4 py-2 rounded-md border border-gray-800 text-white bg-gray-800 hover:bg-gray-700"
            >
              Đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

import { getOrderStatus } from "@/lib/db";
import OrderTable from "./orderTable";
import { auth } from "@/auth";

export default async function OrderPage() {
  const orderStatus = await getOrderStatus("nhanvien");
  const session = await auth();
  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Đơn hàng
        </h1>
      </div>
      <OrderTable orderStatus={orderStatus} user={session?.user} />
    </div>
  );
}

import { getOrderStatus } from "@/lib/db";
import DeliveryOrderTable from "./deliveryTable";
import { auth } from "@/auth";

export default async function DeliveryPage() {
  const orderStatus = await getOrderStatus("vanchuyen");
  const session = await auth();
  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Đơn hàng vận chuyển
        </h1>
      </div>
      <DeliveryOrderTable orderStatus={orderStatus} user={session?.user} />
    </div>
  );
}

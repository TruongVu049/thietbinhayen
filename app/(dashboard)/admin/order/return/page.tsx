import { getOrderStatus } from "@/lib/db";
import ReturnOrderTable from "./returnTable";

export default async function DeliveryPage() {
  const orderStatus = await getOrderStatus("doitra");
  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Đổi trả
        </h1>
      </div>
      <ReturnOrderTable orderStatus={orderStatus} />
    </div>
  );
}

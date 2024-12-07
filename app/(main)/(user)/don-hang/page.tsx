import { getOrderStatus } from "@/lib/db";
import OrderList from "./orderList";
import { auth } from "@/auth";

export default async function OrderPage() {
  const session = await auth();
  const orderStatus = await getOrderStatus("khachhang");
  return (
    <div className="tabs">
      <OrderList
        orderStatus={orderStatus.filter((item) => item.id < 7)}
        user={session?.user}
      />
    </div>
  );
}

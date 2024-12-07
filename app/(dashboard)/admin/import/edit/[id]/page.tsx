import { getPurchaseOrderDetail } from "@/lib/db";
import EditForm from "./editForm";
export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const purchaseOrder = await getPurchaseOrderDetail(Number(params.id));
  console.log("purchaseOrder", purchaseOrder);

  return (
    <main className="sm:p-4 p-2 space-y-6">
      <EditForm purchaseOrderP={purchaseOrder} />
    </main>
  );
}

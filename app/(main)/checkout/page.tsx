import { auth } from "@/auth";
import { ChiTietGioHang } from "@/lib/db/types";
import CheckoutForm from "./checkoutForm";
import { getProductCheckout } from "@/lib/db";

export default async function CheckOutPage({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const session = await auth();

  const parsedSearchParams = searchParams?.search
    ? (JSON.parse(searchParams.search) as ChiTietGioHang[])
    : [];

  const orderDetail = parsedSearchParams.map((item) => {
    return {
      sanpham_id: item.id ? item.id : 0,
      hoadon_id: 0,
      soluong: item.soluong,
      dongia: 0,
    };
  });

  const productCheckout = await getProductCheckout(orderDetail);

  return (
    <main className="max-w-screen-xl block mx-auto">
      <CheckoutForm user={session?.user} products={productCheckout} />
    </main>
  );
}

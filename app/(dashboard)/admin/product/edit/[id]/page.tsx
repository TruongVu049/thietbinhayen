import UpdateProductForm from "./updateProductForm";
import { getXuatXus, getDanhmucs, getProduct } from "@/lib/db";
export default async function UpdateProductPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) return null;
  const product = await getProduct(params.id);
  const dms = await getDanhmucs();
  const xxs = await getXuatXus();
  console.log(product);
  return (
    <main className="bg-[rgb(241_245_249)] sm:p-4 p-2 space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="xl:text-2xl text-xl font-semibold leading-6">
            Cập nhật sản phẩm
          </h1>
        </div>
      </div>
      <UpdateProductForm product={product} danhmucs={dms} xuatxus={xxs} />
    </main>
  );
}

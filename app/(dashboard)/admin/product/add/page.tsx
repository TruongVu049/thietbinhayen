import AddProductForm from "./addProductForm";
import { getXuatXus, getDanhmucs } from "@/lib/db";
export default async function AddProductPage() {
  const dms = await getDanhmucs();
  const xxs = await getXuatXus();
  return (
    <main className="bg-[rgb(241_245_249)] sm:p-4 p-2 space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="xl:text-2xl text-xl font-semibold leading-6">
            Thêm sản phẩm
          </h1>
        </div>
      </div>
      <AddProductForm danhmucs={dms} xuatxus={xxs} />
    </main>
  );
}

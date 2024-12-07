import Footer from "@/components/layout/footer";
import BreadcrumbCustom from "@/components/breadcrumbCustom";
import ProductFilter from "@/components/product/productFilter";
import ProductSort from "@/components/product/productSort";
import ToggleFilter from "@/components/toggleFilter";
import { getDanhmucs } from "@/lib/db";
const link = [
  {
    id: 1,
    title: "Trang chủ",
    path: "/",
  },
];
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getDanhmucs();

  return (
    <>
      <section className="max-w-screen-xl block mx-auto relative">
        <div className="px-4 md:px-6 md:py-4 py-3 md:text-lg text-base">
          <BreadcrumbCustom
            links={[
              ...link,
              {
                id: 2,
                title: "Sản phẩm",
              },
            ]}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="hidden md:block md:col-span-2 w-full max-md:max-w-md max-md:mx-auto">
              <div className="rounded-xl border border-gray-300 bg-white p-3 w-full md:max-w-sm">
                <ProductFilter categories={categories} />
              </div>
            </div>
            <div className="col-span-12 md:col-span-10">
              <section className="">
                <div className="mx-auto max-w-screen-xl 2xl:px-0">
                  <div className="flex items-center md:justify-end justify-between rounded-xl border border-gray-300 bg-white p-3 mb-4">
                    <ToggleFilter categories={categories} />
                    <div className="md:w-2/6">
                      <ProductSort />
                    </div>
                  </div>
                  {children}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-4">
        <Footer />
      </div>
    </>
  );
}

import Title from "@/components/title";
import { CarouselPlugin } from "@/components/ui/carouselPlugin";
import Link from "next/link";
import { Archive, ChevronRight } from "lucide-react";
import Footer from "@/components/layout/footer";
import {
  getDanhmucs,
  getNewProducts,
  getTopSellingProducts,
  getProductsByCategory,
} from "@/lib/db";
import { DanhMuc } from "@/lib/db/types";
import { Fragment, Suspense } from "react";
import Featured from "@/components/featured";
import PopularPost from "@/components/post/popularPosts";

export default async function Home() {
  const categories = await getDanhmucs();
  return (
    <>
      <div className="max-w-screen-xl block mx-auto">
        <div className="md:grid md:grid-cols-5 flex flex-col-reverse md:gap-4 gap-2 px-2 md:px-6 ">
          <div className="md:col-span-1 col-span-full bg-white  p-3  mt-3  border-r-2 border-gray-300">
            <div className="md:hidden">
              <Title title="Danh mục" description="Danh mục nổi bật" />
            </div>
            <div className="py-2 grid md:grid-cols-1 grid-cols-2 gap-2 w-full">
              {categories &&
                categories.map((item: DanhMuc) => (
                  <Link
                    key={item.id}
                    href={`/search?categories=${item.id}`}
                    className=" flex group md:justify-between md:items-center md:flex-row flex-col justify-center items-center group md:text-base text-gray-900 font-medium text-lg leading-8  md:text-muted-foreground transition-colors md:hover:text-rose-500 md:hover:bg-white
                  md:border-none md:text-left text-center border border-gray-300 line-clamp-1  rounded-2xl md:p-0 py-3 px-6 hover:text-white hover:bg-rose-500 
                  "
                  >
                    <Archive className="md:hidden mx-auto group-hover:text-white w-5 h-5 text-gray-800 text-center" />
                    {item.ten}
                    <ChevronRight className="md:inline hidden h-5 text-gray-900 group-hover:text-rose-500  " />
                  </Link>
                ))}
            </div>
          </div>
          <div className="md:col-span-4 mt-3 overflow-hidden">
            <CarouselPlugin />
          </div>
        </div>
        <hr className="my-4" />
        <div className="px-2 md:px-6">
          <Suspense>
            <Featured handleGetProduct={getNewProducts}>
              <div className="flex items-center justify-between flex-wrap">
                <Title title="New's" description="Sản phẩm mới" />
                <Link
                  href={"/search?sort=ngay-tao"}
                  className="flex items-center gap-1 group hover:text-rose-500 "
                >
                  Xem thêm
                  <ChevronRight className="w-6 h-6 text-gray-900 group-hover:text-rose-500" />
                </Link>
              </div>
            </Featured>
          </Suspense>
        </div>

        <hr className="my-4" />
        <div className="px-2 md:px-6">
          <Suspense>
            <Featured handleGetProduct={getTopSellingProducts}>
              <div className="flex items-center justify-between flex-wrap">
                <Title
                  title="Tháng này"
                  description="Các sản phẩm được mua nhiều nhất"
                />
                <Link
                  href={"/search"}
                  className="flex items-center gap-1 group hover:text-rose-500 "
                >
                  Xem thêm
                  <ChevronRight className="w-6 h-6 text-gray-900 group-hover:text-rose-500" />
                </Link>
              </div>
            </Featured>
          </Suspense>
        </div>

        {categories &&
          categories.map((item: DanhMuc) => (
            <Fragment key={item.id}>
              <hr className="my-4" />
              <div className="px-2 md:px-6">
                <Suspense>
                  <Featured
                    handleGetProduct={() =>
                      getProductsByCategory(item.id?.toString() ?? "0")
                    }
                  >
                    <div className="flex items-center justify-between flex-wrap">
                      <Title title="Danh mục" description={item.ten} />
                      <Link
                        href={`/search?categories=${item.id}`}
                        className="flex items-center gap-1 group hover:text-rose-500 "
                      >
                        Xem thêm
                        <ChevronRight className="w-6 h-6 text-gray-900 group-hover:text-rose-500" />
                      </Link>
                    </div>
                  </Featured>
                </Suspense>
              </div>
            </Fragment>
          ))}

        <hr className="my-4" />
        <div className="px-2 md:px-6">
          <Title title="Tháng này" description="Tin tức nổi bật" />
          <div className="py-5">
            <Suspense>
              <PopularPost />
            </Suspense>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      <Footer />
    </>
  );
}

import Grid from "@/components/grid";
import ProductGridItems from "@/components/product/productGridItems";
import CustomPagination from "@/components/customPagination";
import { Suspense } from "react";
import { ProductSkeleton } from "@/components/product/productGridItems";
import { getProducts } from "@/lib/db";

export default async function ProductPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    sort?: string;
    categories?: string;
    minPrice?: number;
    maxPrice?: number;
    p?: number;
  };
}) {
  const search: string = searchParams?.q || "";
  const currentPage: number = searchParams?.p || 1;
  const sort = searchParams?.sort || "";
  const minPrice = searchParams?.minPrice || 0;
  const maxPrice = searchParams?.maxPrice || 0;
  const categories = searchParams?.categories || "";

  const { dssp, tongtrang } = await getProducts({
    timkiem: search,
    trang: currentPage,
    sapxep: sort,
    giatoithieu: minPrice,
    giatoida: maxPrice,
    danhmuc_ids: categories,
  });
  return (
    <>
      {search && (
        <div className="text-center mb-3">
          <h4 className="md:text-lg text-base text-gray-900 ">
            Kết quả tìm kiếm cho từ khóa &qpos;
            <strong className="text-rose-500 md:text-xl text-lg">
              {search}
            </strong>
            &qpos;
          </h4>
        </div>
      )}
      <Grid className="relative mb-4 grid gap-4 grid-cols-2 md:mb-8 md:lg:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <Suspense
          key={search + currentPage + sort + minPrice + maxPrice + categories}
          fallback={<ProductSkeleton length={5} />}
        >
          {/* <Table query={query} currentPage={currentPage} /> */}
          <ProductGridItems products={dssp} />
        </Suspense>
      </Grid>
      {tongtrang ? (
        <div className="flex justify-end mb-5 ">
          <Suspense>
            <CustomPagination totalPages={Number(tongtrang)} />
          </Suspense>
        </div>
      ) : null}
    </>
  );
}

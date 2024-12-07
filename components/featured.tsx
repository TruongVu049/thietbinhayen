import { SanPham } from "@/lib/db/types";
import Grid from "@/components/grid";
import { ReactNode } from "react";
import ProductGridItems from "./product/productGridItems";

export default async function Featured({
  children,
  handleGetProduct,
}: {
  children: ReactNode;
  handleGetProduct: () => Promise<SanPham[]>;
}) {
  const products: SanPham[] = await handleGetProduct();
  return (
    <>
      {children}
      {products && products.length ? (
        <Grid className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4  lg:grid-cols-5 mt-2">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}

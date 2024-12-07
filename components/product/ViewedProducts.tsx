"use client";
import React, { useEffect, useState } from "react";
import { useViewedProducts } from "../hooks/useViewedProducts";
import { SanPham } from "@/lib/db/types";
import Grid from "../grid";
import ProductGridItems from "./productGridItems";

const ViewedProducts = ({ productId }: { productId: number }) => {
  const { fetchViewedProducts, addProduct } = useViewedProducts();
  const [viewedProducts, setViewedProducts] = useState<SanPham[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchViewedProducts();
      setViewedProducts(products);
      addProduct(productId);
    };
    fetchProducts();
  }, [fetchViewedProducts]);

  console.log(viewedProducts);
  return (
    <Grid className="grid-cols-1 sm:grid-cols-3 md:grid-cols-4  lg:grid-cols-5 mt-4">
      <ProductGridItems products={viewedProducts} isHiddenBG={true} />
    </Grid>
  );
};

export default ViewedProducts;

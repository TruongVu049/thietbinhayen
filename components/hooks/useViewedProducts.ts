import { getViewedProductsData } from "@/lib/db";
import { SanPham } from "@/lib/db/types";
import { useCallback } from "react";

const MAX_SIZE = 5;

export const useViewedProducts = () => {
  const STORAGE_KEY = "viewedProducts";

  const getViewedProducts = useCallback((): number[] => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }, []);

  const addProduct = useCallback(
    (productId: number) => {
      if (typeof window === "undefined") return;

      const viewedProducts = getViewedProducts();

      if (viewedProducts.includes(productId)) {
        // Move the existing product to the end
        const updatedProducts = [
          ...viewedProducts.filter((id) => id !== productId),
          productId,
        ];
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedProducts)
        );
        return;
      }

      // Add new product, ensuring the size doesn't exceed MAX_SIZE
      if (viewedProducts.length >= MAX_SIZE) {
        viewedProducts.shift(); // Remove the first item
      }

      viewedProducts.push(productId);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedProducts));
    },
    [getViewedProducts]
  );

  const clearViewedProducts = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const fetchViewedProducts = useCallback(async (): Promise<SanPham[]> => {
    const ids = getViewedProducts();
    if (!ids.length) return [];

    try {
      const products = await getViewedProductsData(ids.join("_"));
      return products;
    } catch (error) {
      console.error("Error fetching viewed products:", error);
      return [];
    }
  }, [getViewedProducts]);

  return {
    getViewedProducts,
    addProduct,
    clearViewedProducts,
    fetchViewedProducts,
  };
};

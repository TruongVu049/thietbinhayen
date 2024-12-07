"use client";
import { DanhMuc } from "@/lib/db/types";
import { useEffect, useState } from "react";
import { getCategoryList } from "@/lib/db";
import CategoryForm from "./categoryForm";

export default function CategoryPage() {
  const [categoryList, setCategoryList] = useState<DanhMuc[]>([]);

  useEffect(() => {
    Promise.all([getCategoryList()]).then((results) => {
      setCategoryList(results[0]);
    });
  }, []);

  console.log(categoryList);

  function handleSetCategoryList(category: DanhMuc) {
    setCategoryList([...categoryList, category]);
  }

  function handleUpdateCategoryList(category: DanhMuc) {
    setCategoryList(
      categoryList.map((item) => {
        if (item.id === category.id) return category;
        return item;
      })
    );
  }

  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div>
        <CategoryForm
          categoryList={categoryList}
          onSetCategoryList={handleSetCategoryList}
          onUpdateCategoryList={handleUpdateCategoryList}
        />
      </div>
    </div>
  );
}

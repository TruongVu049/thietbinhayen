"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import ProductFilter from "./product/productFilter";
import { DanhMuc } from "@/lib/db/types";

export default function ToggleFilter({
  categories,
}: {
  categories: DanhMuc[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white">
        <div className="mt-4"></div>
        <ProductFilter categories={categories} />
      </SheetContent>
    </Sheet>
  );
}

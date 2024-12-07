"use client";
import * as React from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { HinhAnhSanPham } from "@/lib/db/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ImageKit from "../imagekit";

export function CarouselProduct({ images }: { images: HinhAnhSanPham[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function handleChangeCurrent(index: number) {
    if (api) {
      api.scrollTo(index); // Di chuyển đến slide theo chỉ số
      setCurrent(index + 1); // Cập nhật current
    }
  }

  return (
    <div className="h-full">
      <div className="relative mb-6">
        <Carousel setApi={setApi}>
          <CarouselContent className="">
            {images?.map((item: HinhAnhSanPham) => (
              <CarouselItem key={item.id}>
                <div className="relative w-full lg:min-h-96 md:min-h-80 min-h-72">
                  <ImageKit
                    alt={`image ${item.id}`}
                    height={800}
                    width={600}
                    className="max-lg:mx-auto rounded-2xl w-full h-52  object-contain"
                    path={item.duongdan}
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex items-center gap-3 justify-between">
        {images?.map((item: HinhAnhSanPham, index: number) => (
          <div
            key={item.id}
            onClick={() => handleChangeCurrent(index)} // Truyền index vào hàm handleChangeCurrent
            className={`block relative w-full sm:h-28 h-20 border rounded-lg hover:border-rose-500 ${
              index === current - 1 && "border-rose-500"
            }`}
          >
            <ImageKit
              alt={`image gallary ${item.id}`}
              height={800}
              width={600}
              className="w-full sm:h-28 h-20 object-contain cursor-pointer rounded-xl transition-all duration-500"
              path={item.duongdan}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

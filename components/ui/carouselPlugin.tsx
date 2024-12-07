"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageKit from "../imagekit";

const bannerList = [
  {
    id: 1,
    path: "loa-1400x788.jpg",
  },
  {
    id: 2,
    path: "BANNER-AMPLI-1400x787.jpg",
  },
  {
    id: 3,
    path: "banner.jpg",
  },
];

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full relative"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="">
        {bannerList?.map((item) => (
          <CarouselItem key={item.id}>
            <div className="h-72">
              <div className="relative h-full w-full ">
                <ImageKit
                  className="object-fill rounded-lg overflow-hidden"
                  path={item.path}
                  alt="image"
                  loading="lazy"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute top-1/2 transform-gpu -translate-y-1/2 left-24 right-20">
        <div className="flex items-center justify-between">
          <CarouselPrevious className="text-white " />
          <CarouselNext className="text-white " />
        </div>
      </div>
    </Carousel>
  );
}

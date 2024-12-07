"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageKit from "./imagekit";
type DialogImageProps = {
  images: string[];
};

const DialogImage: React.FC<DialogImageProps> = ({ images }) => {
  const [openModal, setOpenModal] = useState(false);
  const imageRef = useRef("");
  return (
    <>
      <div className="flex items-center gap-3 flex-wrap mt-2">
        {images &&
          images.map((img) => (
            <div
              key={img}
              onClick={() => {
                imageRef.current = img;
                setOpenModal(true);
              }}
              className="cursor-pointer relative h-24 w-24  rounded-lg border-2 border-blue-200 "
            >
              <ImageKit
                path={img}
                alt="image"
                className="object-contain"
                loading="lazy"
              />
            </div>
          ))}
      </div>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[825px] bg-white">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="p-2 w-full flex justify-center">
            <div className="cursor-pointer relative md:h-96 md:w-96 w-48 h-48 ">
              <ImageKit
                path={imageRef.current}
                alt="image"
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogImage;

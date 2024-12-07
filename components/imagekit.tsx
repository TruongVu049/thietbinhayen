"use client";
import React from "react";
import { IKImage } from "imagekitio-next"; // Đảm bảo bạn dùng đúng package
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

interface ImageProps {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | undefined;
  className?: string;
  // transformation?: TransformationProps[];
}

export default function ImageKit(props: ImageProps) {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      transformation={[
        {
          height: props?.height?.toString() ?? "300",
          width: props?.width?.toString() ?? "400",
        },
      ]}
      lqip={{ active: true, quality: 20 }}
      {...props}
    />
  );
}

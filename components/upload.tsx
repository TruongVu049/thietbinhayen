"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";
import { FileDiff, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { FileInput } from "@/lib/types";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY as string;

if (!urlEndpoint || !publicKey) {
  throw new Error("Missing ImageKit configuration in environment variables");
}

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/imagekit");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
    throw new Error(`Authentication request failed: ${errorMessage}`);
  }
};

const onError = (err: unknown) => {
  console.error("Error", err);
};

export default function Upload({
  uploadedFilePath,
  onUploadedFilePath,
}: {
  uploadedFilePath: FileInput | null;
  onUploadedFilePath: (url: string, id?: number) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ikUploadRef = useRef<HTMLInputElement>(null);

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <span className="">
        <label
          id="upload"
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <FileDiff className="h-6 w-6 fill-white stroke-indigo-500" />
          <button
            onClick={() => ikUploadRef.current?.click()}
            type="button"
            className="text-gray-600 font-medium"
          >
            Upload
          </button>
        </label>
        <IKUpload
          ref={ikUploadRef}
          useUniqueFileName
          onError={onError}
          onSuccess={(res: any) => {
            onUploadedFilePath(
              res.url.replace(urlEndpoint, ""),
              uploadedFilePath?.id
            );
            setIsLoading(false);
          }}
          onUploadStart={() => setIsLoading(true)}
          className="hidden"
        />
        {uploadedFilePath?.url && (
          <IKImage
            path={uploadedFilePath?.url}
            width="200"
            height="200"
            className="w-16 h-auto object-cover"
            alt="Uploaded Image"
          />
        )}
        {isLoading && (
          <div className="">
            <LoaderCircle className="mx-auto animate-spin h-5 w-5" />
          </div>
        )}{" "}
      </span>
    </ImageKitProvider>
  );
}

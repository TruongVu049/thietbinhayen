"use client";
import { CirclePlus, CircleXIcon } from "lucide-react";
import React from "react";
import Upload from "./upload";
import { FileInput } from "@/lib/types";

const limit = 6;
export default function FilesInput({
  imageList,
  onChangeAddFileInput,
  onChangeFileInput,
  onChangeRemoveInput,
}: {
  imageList: FileInput[];
  onChangeAddFileInput: () => void;
  onChangeFileInput: (url: string, id?: number) => void;
  onChangeRemoveInput: (id: number) => void;
}) {
  return (
    <>
      <div className="flex gap-4 items-center">
        <div className="flex gap-4 items-center flex-wrap">
          <div
            title="Ảnh đại diện"
            className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-18 "
          >
            <Upload
              uploadedFilePath={imageList[0]}
              onUploadedFilePath={onChangeFileInput}
            />
          </div>
          {imageList.map((item, index) => {
            if (index === 0) return null;
            return (
              <div
                key={item.id}
                title="Ảnh sản phẩm"
                className="relative group rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-18 "
              >
                <Upload
                  uploadedFilePath={item}
                  onUploadedFilePath={onChangeFileInput}
                />
                <button
                  type="button"
                  onClick={() => {
                    onChangeRemoveInput(item.id);
                  }}
                  className="absolute hidden group-hover:block duration-200 top-[-10px] right-[-10px] z-10"
                >
                  <CircleXIcon className=" w-6 h-6 text-rose-500 hover:text-rose-400 bg-white rounded-full" />
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          disabled={imageList.length - 1 >= limit - 1}
          onClick={onChangeAddFileInput}
          className="bg-gray-100 rounded-xl p-3 hover:bg-indigo-300 duration-200"
          title="Thêm hình ảnh"
        >
          <CirclePlus className="w-8 h-8 text-indigo-500 " />
        </button>
      </div>
    </>
  );
}

"use client";
import { CreateRating } from "@/lib/db";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/submitButton";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { ChiTietHoaDon, DanhGia } from "@/lib/db/types";
import { Label } from "./ui/label";
import { Star } from "lucide-react";
import FilesInput from "./filesInput";
import { FileInput } from "@/lib/types";
import { ToastAction } from "@radix-ui/react-toast";
import { toast } from "@/hooks/use-toast";

type Rate = {
  id: number;
  star: number;
  title: string;
};

const rateData: Rate[] = [
  { id: 1, star: 1, title: "Rất tệ" },
  { id: 2, star: 2, title: "Tệ" },
  { id: 3, star: 3, title: "Bình thường" },
  { id: 4, star: 4, title: "Hài lòng" },
  { id: 5, star: 5, title: "Tuyệt vời" },
];

export default function Rating({
  user,
  orderDetail,
}: {
  user: User;
  orderDetail: ChiTietHoaDon | null;
}) {
  const [ratingState, setRatingState] = useState(orderDetail?.isDanhGia);
  const [openModal, setOpenModal] = useState(false);
  const [rating, setRating] = useState<Rate | null>(
    rateData[rateData.length - 1]
  );
  const [hover, setHover] = useState<Rate | null>(null);
  const [imageList, setImageList] = useState<FileInput[]>([
    {
      id: Date.now(),
      url: null,
    },
  ]);

  //handle image list
  const handleAddFileInput = (): void => {
    setImageList([...imageList, { id: Date.now(), url: null }]);
  };

  function handleFileInput(url: string, id?: number) {
    setImageList(
      imageList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            url: url,
          };
        }
        return item;
      })
    );
  }

  function handleRemoveInput(id: number) {
    setImageList(imageList.filter((item) => item.id !== id));
  }

  const actionCreate = CreateRating.bind(null);

  return (
    <>
      <button
        type="button"
        disabled={ratingState}
        className={`${
          ratingState
            ? "pointer-events-none opacity-80 text-gray-700 border-gray-700"
            : "text-rose-500 border-rose-500"
        } hover:bg-rose-400 hover:text-white rounded-lg  border border-solid  px-4 py-2`}
        onClick={() => {
          if (orderDetail) {
            setOpenModal(true);
          }
        }}
      >
        {ratingState ? "Đã đánh giá" : "Đánh giá"}
      </button>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[725px] bg-white">
          <DialogHeader>
            <DialogTitle>Đánh giá</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form
            className="grid items-start gap-4"
            action={async (formData: FormData) => {
              const strImages = imageList
                .map((item: FileInput) => {
                  return item.url ?? "";
                })
                .join("____");
              const ratingData: DanhGia = {
                id: 0,
                sosao: rating?.star ?? 1,
                noidung: formData.get("noidung")?.toString() ?? "",
                khachhang_id: Number(user.id),
                hinhanh: strImages,
                sanpham_id: orderDetail?.sanpham_id ?? 0,
                hoadon_id: orderDetail?.hoadon_id ?? 0,
              };
              const res = await actionCreate(ratingData);
              if (res.status === 200) {
                toast({
                  title: `Đánh giá sản phẩm thành công.`,
                  description: ``,
                  action: (
                    <ToastAction className="border-none" altText="Try again">
                      <div className="flex gap-2 items-center">
                        <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                          OK
                        </button>
                      </div>
                    </ToastAction>
                  ),
                  className: "bg-white border-green-500",
                });
                setRatingState(true);
                setOpenModal(false);
              } else {
                toast({
                  title: `Đánh giá sản phẩm không thành công.`,
                  description: `Vui lòng thực hiện lại!`,
                  action: (
                    <ToastAction className="border-none" altText="Try again">
                      <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                        Thử lại
                      </button>
                    </ToastAction>
                  ),
                  className: "bg-white border-rose-500",
                });
              }
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="ten">Số sao</Label>
              <div className="flex items-center">
                {rateData.map((item) => (
                  <span key={item.id} className="cursor-pointer">
                    <Star
                      onClick={() => setRating(item)}
                      onMouseOver={() => setHover(item)}
                      onMouseOut={() => setHover(null)}
                      className={`${
                        item.star <= (hover?.star || rating?.star || 0)
                          ? "text-amber-500"
                          : "text-gray-700"
                      } w-8 h-8 hover:text-amber-500`}
                    />
                  </span>
                ))}
                <span className="md:text-base text-sm text-gray-700 mt-1 ml-4">
                  {hover ? hover.title : rating?.title}
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ten">Nội dung</Label>
              <textarea
                id="noidung"
                name="noidung"
                rows={2}
                required
                className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ten">Hình ảnh</Label>
              <div>
                <FilesInput
                  imageList={imageList}
                  onChangeAddFileInput={handleAddFileInput}
                  onChangeFileInput={handleFileInput}
                  onChangeRemoveInput={handleRemoveInput}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <Button
                onClick={() => setOpenModal(false)}
                type="button"
                variant="outline"
                className="w-1/2"
              >
                Hủy
              </Button>
              <SubmitButton
                cName="w-1/2 bg-rose-500 hover:bg-rose-400 text-white"
                label="Gửi đánh giá"
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

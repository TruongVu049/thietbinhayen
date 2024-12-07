"use client";
import { getRatingList, replyRating, updateRating } from "@/lib/db";
import { DanhGia } from "@/lib/db/types";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomPagination from "@/components/customPagination";
import ImageKit from "@/components/imagekit";
import { FormatDate } from "@/helpers/utils";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submitButton";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
export default function RatingPage() {
  const [ratingType, setRatingType] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [ratingList, setRatingList] = useState<DanhGia[] | []>([]);

  const [openModal, setOpenModal] = useState(false);
  const ratingRef = useRef<DanhGia | null>(null);

  useEffect(() => {
    let ignore = false;
    setRatingList([]);
    setIsLoading(true);
    getRatingList(ratingType)
      .then((result) => {
        if (!ignore) {
          setRatingList(result);
        }
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
        console.log(errorMessage);
      })
      .finally(() => setIsLoading(false));

    return () => {
      ignore = true;
    };
  }, [ratingType]);

  function handleRemoveRating(id: number) {
    ratingList.length &&
      setRatingList(ratingList.filter((item) => item.id !== id));
  }

  function handleUpdateRatingList(id: number, reply: string = "") {
    ratingList.length &&
      setRatingList(
        ratingList.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              trangthai: true,
              traloi: reply,
            };
          }
          return item;
        })
      );
  }

  const actionUpdate = updateRating.bind(null);
  const actionReply = replyRating.bind(null);

  async function handleActionUpdateRating(id: number, isApprove: boolean) {
    actionUpdate(id, isApprove)
      .then((res) => {
        if (res.status === 200) {
          if (isApprove) {
            handleUpdateRatingList(res.body);
          } else {
            handleRemoveRating(res.body);
          }
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="inline-block xl:text-2xl text-xl font-semibold leading-6">
          Đánh giá sản phẩm
        </h1>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-lg p-2">
          <div className="p-3 flex gap-4 items-center">
            <div
              onClick={() => setRatingType("")}
              className={`${
                ratingType === "" ? "text-white bg-indigo-500" : "text-gray-800"
              } p-3 rounded-md border hover:bg-indigo-500 hover:text-white cursor-pointer`}
            >
              <span className="md:text-lg text-base ">Tất cả</span>
            </div>
            <div
              onClick={() => setRatingType("chuaduyet")}
              className={`${
                ratingType === "chuaduyet"
                  ? "text-white bg-indigo-500"
                  : "text-gray-800"
              } p-3 rounded-md border hover:bg-indigo-500 hover:text-white cursor-pointer`}
            >
              <span className="md:text-lg text-base ">Chưa duyệt</span>
            </div>
            <div
              onClick={() => setRatingType("daduyet")}
              className={`${
                ratingType === "daduyet"
                  ? "text-white bg-indigo-500"
                  : "text-gray-800"
              } p-3 rounded-md border hover:bg-indigo-500 hover:text-white cursor-pointer`}
            >
              <span className="md:text-lg text-base ">Đã duyệt</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 ">
          <div className="bg-white rounded-lg">
            <div className="btn-toolbar border-b border-gray-300 px-5 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-3">
              <div className="pt-2 relative  text-gray-600 sm:w-auto w-full">
                <div>
                  <form action="" method="get">
                    <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col items-start gap-4">
                      <input
                        className="submit_on_enter sm:w-auto  w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                        type="text"
                        name="s"
                        placeholder="Tìm kiếm đơn hàng..."
                        defaultValue=""
                      />
                      <div id="remove-all" className="sm:block hidden">
                        |
                      </div>
                      <div className="sm:w-auto w-full">
                        <label
                          htmlFor="sort"
                          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        />
                        <select
                          name="sx"
                          id="sort"
                          className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Sắp xếp đơn hàng</option>
                          <option value="gia_asc">Giá tăng dần</option>
                          <option value="gia_desc">Giá giảm dần</option>
                          <option value="ngaytao_asc">Ngày tăng dần</option>
                          <option value="ngaytao_desc">Ngày giảm dần</option>
                        </select>
                      </div>
                      <input
                        type="submit"
                        className="sr-only"
                        defaultValue="Submit"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="relative overflow-x-auto">
              <table className="text-left w-full whitespace-nowrap">
                <thead className="bg-gray-200 text-gray-700">
                  <tr className="border-b border-gray-300">
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="product_name"
                    >
                      ID
                    </th>
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="category_name"
                    >
                      Khách hàng
                    </th>
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="price_dollor"
                    >
                      Số sao
                    </th>
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="quantity_numbers"
                    >
                      Nội dung
                    </th>
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="status_info"
                    >
                      Hình ảnh
                    </th>
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="status_info"
                    >
                      Ngày tạo
                    </th>
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="status_info"
                    >
                      Trạng thái
                    </th>
                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="status_info"
                    >
                      Trả lời
                    </th>

                    <th
                      className="listjs-sorter px-6 py-3"
                      data-sort="action_info"
                    ></th>
                  </tr>
                </thead>
                <tbody className="list">
                  {isLoading ? (
                    new Array(4).fill(1).map((item: number, index: number) => (
                      <tr
                        key={index}
                        className="animate-pulse border-b h-full "
                      >
                        <td
                          colSpan={9}
                          className=" w-full h-6 m-2 bg-gray-200  "
                        ></td>
                      </tr>
                    ))
                  ) : ratingList.length ? (
                    ratingList.map((item) => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="product_name px-6 py-3">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <h5 className="">{item.id}</h5>
                            </div>
                          </div>
                        </td>
                        <td className="category_name px-6 py-3">
                          {item.tenkhachhang}
                        </td>
                        <td className="px-6 py-3 ">
                          <div className="flex items-center">
                            {new Array(5).fill(1).map((str, index) => {
                              if (index + 1 <= item.sosao) {
                                return (
                                  <Star
                                    key={`${item}${index}`}
                                    className="w-4 h-4 text-amber-500"
                                  />
                                );
                              }
                              return (
                                <Star
                                  key={`${item}${index}`}
                                  className="w-4 h-4 text-gray-700"
                                />
                              );
                            })}
                          </div>
                        </td>

                        <td className="category_name px-6 py-3">
                          <p className="line-clamp-2">
                            {item.noidung ?? "asdsad"}
                          </p>
                        </td>

                        <td className=" px-6 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {item.hinhanh?.split("____").map((image) => (
                              <div
                                key={image}
                                className="relative h-10 w-10 rounded-lg"
                              >
                                <ImageKit
                                  path={image}
                                  alt="image"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className=" px-6 py-3 ">
                          {item.ngaytao &&
                            FormatDate({ isoDate: item.ngaytao })}
                        </td>

                        <td className="status_info px-6 py-3">
                          <span
                            className={`${
                              item.trangthai
                                ? "text-green-500 bg-green-100 border-green-600"
                                : "text-orange-500 bg-orange-100 border-orange-600"
                            } px-2 py-1 border text-sm font-medium rounded-md inline-block whitespace-nowrap text-center`}
                          >
                            {item.trangthai ? "Đã duyệt" : "Chưa duyệt"}
                          </span>
                        </td>
                        <td className=" px-6 py-3 line-clamp-2">
                          {item.traloi ?? "---"}
                        </td>
                        <td className="action_info px-6 py-3">
                          <div className="flex items-center gap-2">
                            {item.trangthai ? (
                              !item.traloi && (
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  className={`${
                                    isLoading ? "pointer-events-none" : ""
                                  } group rounded-md py-1.5 px-3 border hover:bg-indigo-100 border-indigo-500 text-indigo-500`}
                                  onClick={() => {
                                    if (item.id) {
                                      ratingRef.current = item;
                                      setOpenModal(true);
                                    }
                                  }}
                                >
                                  Trả lời
                                </button>
                              )
                            ) : (
                              <>
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  className={`${
                                    isLoading ? "pointer-events-none" : ""
                                  } group rounded-md py-1.5 px-3 border hover:bg-rose-100 border-rose-500 text-rose-500`}
                                  onClick={() => {
                                    handleActionUpdateRating(item.id, false);
                                  }}
                                >
                                  Từ chối
                                </button>
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  className={`${
                                    isLoading ? "pointer-events-none" : ""
                                  } group rounded-md py-1.5 px-3 border hover:bg-green-100 border-green-500 text-green-500`}
                                  onClick={() => {
                                    handleActionUpdateRating(item.id, true);
                                  }}
                                >
                                  Duyệt
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b h-full ">
                      <td
                        colSpan={9}
                        className=" w-full h-60  m-2 text-center "
                      >
                        <span className="md:text-base text-sm text-gray-600">
                          Chưa có đánh giá
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row justify-end px-6 py-4 gap-2">
              <div>
                <CustomPagination />
              </div>
            </div>
          </div>
        </div>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[625px] bg-white">
            <DialogHeader>
              <DialogTitle>Trả lời</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form
              action={async (formData: FormData) => {
                if (ratingRef.current) {
                  const res = await actionReply(
                    ratingRef.current.id,
                    formData.get("traloi")?.toString() ?? ""
                  );
                  if (res.status === 200) {
                    handleUpdateRatingList(res.body?.id, res.body?.mes);
                    setOpenModal(false);
                  } else {
                    console.log("er");
                    toast({
                      title: res.body ?? `Trả lời đánh giá không thành công.`,
                      description: `Vui lòng thực hiện lại!`,
                      action: (
                        <ToastAction
                          className="border-none"
                          altText="Try again"
                        >
                          <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                            Thử lại
                          </button>
                        </ToastAction>
                      ),
                      className: "bg-white border-rose-500",
                    });
                  }
                }
              }}
              className={`grid items-start gap-4 `}
            >
              <div className="grid gap-2">
                <Label
                  htmlFor="ten"
                  className="text-gray-800 text-base font-bold"
                >
                  Nội dung trả lời
                </Label>
                <textarea
                  id="traloi"
                  rows={4}
                  name="traloi"
                  required
                  className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nội dung trả lời đánh giá của khách hàng..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <Button
                  onClick={() => setOpenModal(false)}
                  type="button"
                  variant={"outline"}
                  className="w-1/2"
                >
                  Trở lại
                </Button>
                <SubmitButton
                  cName="w-1/2 bg-rose-500 hover:bg-rose-400 text-white"
                  label={"Gửi"}
                />
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

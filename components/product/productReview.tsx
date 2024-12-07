"use client";
import { UserCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getRatingOfProduct } from "@/lib/db";
import { DanhGia } from "@/lib/db/types";
import { FormatDate } from "@/helpers/utils";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
type filterStar = {
  id: number;
  star: number;
  name: string;
};

const filterStarList: filterStar[] = [
  {
    id: 0,
    star: 0,
    name: "Tất cả",
  },
  {
    id: 5,
    star: 5,
    name: "5 sao",
  },
  {
    id: 4,
    star: 4,
    name: "4 sao",
  },
  {
    id: 3,
    star: 3,
    name: "3 sao",
  },
  {
    id: 2,
    star: 2,
    name: "2 sao",
  },
  {
    id: 1,
    star: 1,
    name: "1 sao",
  },
];

export default function ProductReview({
  productId,
  star,
}: {
  productId: number;
  star: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [activeFilterStar, setActiveFilterStar] = useState<filterStar | null>(
    filterStarList[0]
  );
  const [ratingList, setRatingList] = useState<{
    dsdg: DanhGia[];
    tongtrang: number;
  } | null>(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    startTransition(() => {
      getRatingOfProduct(productId, activeFilterStar?.star ?? 0, 1)
        .then((result) => {
          if (!ignore && result) {
            setRatingList(result);
          }
        })
        .catch((err: unknown) => {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
          console.log(errorMessage);
        });
    });
    return () => {
      ignore = true;
    };
  }, [activeFilterStar, page]);

  return (
    <section className="relative">
      <div className="w-full lg-6 mx-auto">
        <div className="w-full">
          <div className="flex md:flex-row flex-col items-center md:justify-start justify-center  my-2 bg-[#fffbf8] border border-orange-200 rounded-md md:px-4 md:py-8 py-4  w-full  gap-3">
            <h5 className="flex w-1/4 flex-col items-center md:text-xl text-lg text-orange-600 font-bold">
              <strong className=" ">
                {star != 0 ? Math.ceil(star) : 5} trên 5
              </strong>
              <div className="flex items-center gap-1">
                {new Array(5).fill(1).map((item, index) => (
                  <svg
                    key={item + index}
                    className="w-5 h-5 text-amber-500 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
            </h5>
            <div className="flex md:w-3/4 w-full p-3 items-center flex-wrap gap-3">
              {filterStarList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveFilterStar(item)}
                  className={`${
                    item.id === activeFilterStar?.id ? "bg-rose-200" : ""
                  } hover:bg-rose-200 py-2 px-6 rounded-md border border-rose-500`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div
            className={`${
              isPending
                ? "opacity-80 transition-opacity duration-300"
                : "transition-opacity duration-300"
            }`}
          >
            {ratingList?.dsdg.length ? (
              ratingList?.dsdg.map((item) => (
                <div
                  key={item.id}
                  className="pb-4 border-b border-gray-100 mt-4"
                >
                  <div className="w-full">
                    <div className="flex items-start gap-3 ">
                      <UserCircle className="w-8 h-8 text-gray-700" />
                      <div className="w-full">
                        <h6 className="md:text-base text-sm leading-8 text-indigo-600 ">
                          {item.tenkhachhang} |{" "}
                          <span className="text-gray-700 font-normal">
                            {item.ngaytao &&
                              FormatDate({ isoDate: item.ngaytao })}
                          </span>
                        </h6>
                        <div className="flex items-center">
                          {new Array(5).fill(1).map((st, index) => {
                            if (index + 1 <= item.sosao) {
                              return (
                                <svg
                                  key={st + index}
                                  className="w-5 h-5 text-amber-500 "
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                </svg>
                              );
                            }
                            return (
                              <svg
                                key={st + index}
                                className="w-5 h-5 text-gray-800 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                                />
                              </svg>
                            );
                          })}
                        </div>
                        <p className="font-normal text-lg leading-8 text-gray-700 max-xl:text-justify">
                          {item.noidung}
                        </p>
                        {item.traloi && (
                          <div className="p-2 rounded-md font-normal text-lg leading-8 bg-gray-100 w-full text-gray-800 max-xl:text-justify">
                            Phản hồi của người bán
                            <p className="font-normal md:text-base text-sm leading-8 text-gray-600 ">
                              {item.traloi}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="pb-4 border-b border-gray-100 h-60 flex items-center justify-center">
                <div>
                  <Image
                    src={"/static/images/none-rating.png"}
                    height={300}
                    width={300}
                    className="mx-auto h-auto w-24 rounded-full overflow-hidden"
                    alt="logo-order"
                  />
                  <h6 className="text-gray-600 text-center">
                    Chưa có đánh giá
                  </h6>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={"#"}
                className={page <= 1 ? "pointer-events-none opacity-75" : ""}
                onClick={() => setPage(page - 1)}
              />
            </PaginationItem>

            {new Array(ratingList?.tongtrang)
              .fill(1)
              .map((item: number, index: number) => {
                return (
                  <PaginationItem key={item + index}>
                    <PaginationLink
                      className={
                        index + 1 === page
                          ? "hover:bg-rose-500 text-white bg-rose-500 hover:text-white pointer-events-none"
                          : ""
                      }
                      href={"#"}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
            <PaginationItem>
              <PaginationNext
                className={
                  page >= (ratingList?.tongtrang ?? 0)
                    ? "pointer-events-none opacity-75"
                    : ""
                }
                onClick={() => setPage(page + 1)}
                href={"#"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}

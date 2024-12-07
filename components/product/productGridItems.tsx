import Grid from "../grid";
import Link from "next/link";
import { FormatVND } from "@/helpers/utils";
import ImageKit from "../imagekit";
import { SanPham } from "@/lib/db/types";
import Image from "next/image";
export default function ProductGridItems({
  products,
  isHiddenBG,
}: {
  products: SanPham[];
  isHiddenBG?: boolean;
}) {
  return (
    <>
      {products && products.length
        ? products.map((product) => (
            <Grid.Item key={product.id} className="animate-fadeIn">
              <div className="cursor-pointer hover:-translate-y-1.5 transition-all relative rounded-lg h-full border border-gray-100  p-3 shadow-md  overflow-hidden hover:border-rose-200">
                <Link
                  className="flex flex-col h-full justify-between"
                  href={`/product/${product.id}`}
                >
                  <div className="w-full">
                    <div className="relative h-52">
                      <ImageKit
                        className="h-auto object-contain"
                        path={product.hinhanh}
                        alt="image"
                        loading="lazy"
                      />
                    </div>
                    <div className="pt-3">
                      <h4 className="lg:text-lg md:text-base font-normal text-sm tracking-tight text-slate-900 line-clamp-2 ">
                        {product.ten}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center">
                          {new Array(5).fill(1).map((st, index) => {
                            if (
                              index + 1 <=
                              Math.floor(product.avgDanhGia ?? 0)
                            ) {
                              return (
                                <svg
                                  key={st + index}
                                  className="h-4 w-4 text-yellow-300 "
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={24}
                                  height={24}
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
                                className="h-4 w-4 text-yellow-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                                />
                              </svg>
                            );
                          })}
                          {product.luotmua ? (
                            <span className="ml-2 text-sm text-gray-700">{`(${product.luotmua})`}</span>
                          ) : null}
                        </div>

                        {/* <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      (455)
                    </p> */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-rose-500 md:text-xl text-lg font-semibold">
                        {FormatVND({ amount: Number(product.gia) })}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </Grid.Item>
          ))
        : !isHiddenBG && (
            <>
              <div className="absolute h-44  top-0 left-0 right-0 bottom-0 opacity-70">
                <div className=" py-4 2xl:mt-0 ">
                  <Image
                    className="h-40 object-cover mx-auto"
                    src={"/static/images/none-p.png"}
                    height={400}
                    width={400}
                    alt="image"
                  />
                </div>
                <h3 className="uppercase opacity-70 sm:text-lg text-base text-center">
                  Không tìm thấy sản phẩm
                </h3>
              </div>
              <div className="md:h-44 h-52"></div>
            </>
          )}
    </>
  );
}

export function ProductSkeleton({ length }: { length: number }) {
  return new Array(length).fill(1).map((item: number, index: number) => (
    <Grid.Item key={item + index} className="animate-pulse h-full">
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm h-full">
        <div className="block">
          <div className=" bg-gray-200 h-52 w-full"></div>
          <div className="pt-3 flex flex-col gap-3">
            <div className="rounded-lg bg-gray-200 lg:h-9 h-6 w-full"></div>
            <div className="rounded-lg bg-gray-200  sm:h-5 h-6 w-full"></div>
            <div className="rounded-lg bg-gray-200 sm:h-5 h-6 w-full"></div>
          </div>
        </div>
      </div>
    </Grid.Item>
  ));
}

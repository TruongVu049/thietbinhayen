import { FormatVND } from "@/helpers/utils";
import { CarouselProduct } from "./carouselProduct";
import { SanPham } from "@/lib/db/types";
import { AddToCart } from "../cart/add-to-cart";

export default function ProductOverview({ product }: { product: SanPham }) {
  return (
    <section className="py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="slider-box w-full h-full max-lg:mx-auto mx-0 lg:pr-16 overflow-hidden">
            <CarouselProduct
              images={[
                { id: 0, duongdan: product.hinhanh },
                ...(product?.hinhAnhSanPhams ?? []),
              ]}
            />
          </div>
          <div className="flex justify-center items-start">
            <div className="pro-detail w-full max-lg:max-w-[608px]   max-lg:mx-auto max-lg:mt-8">
              <div className="flex items-center justify-between gap-6 mb-6">
                <div className="text">
                  <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2">
                    {product.ten}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="font-normal text-base text-gray-500">
                      {product.danhmuc}
                    </p>
                    <div className="flex items-center">
                      {product.luotmua ? (
                        <span className="text-gray-700 mr-2">{`(Đã bán ${product.luotmua})`}</span>
                      ) : null}
                      <button className="flex items-center gap-1 rounded-lg bg-amber-400 py-1.5 px-2.5 w-max">
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_12657_16865)">
                            <path
                              d="M8.10326 2.26718C8.47008 1.52393 9.52992 1.52394 9.89674 2.26718L11.4124 5.33818C11.558 5.63332 11.8396 5.83789 12.1653 5.88522L15.5543 6.37768C16.3746 6.49686 16.7021 7.50483 16.1086 8.08337L13.6562 10.4738C13.4205 10.7035 13.313 11.0345 13.3686 11.3589L13.9475 14.7343C14.0877 15.5512 13.2302 16.1742 12.4966 15.7885L9.46534 14.1948C9.17402 14.0417 8.82598 14.0417 8.53466 14.1948L5.5034 15.7885C4.76978 16.1742 3.91235 15.5512 4.05246 14.7343L4.63137 11.3589C4.68701 11.0345 4.57946 10.7035 4.34378 10.4738L1.89144 8.08337C1.29792 7.50483 1.62543 6.49686 2.44565 6.37768L5.8347 5.88522C6.16041 5.83789 6.44197 5.63332 6.58764 5.33818L8.10326 2.26718Z"
                              fill="white"
                            />
                            <g clipPath="url(#clip1_12657_16865)">
                              <path
                                d="M8.10326 2.26718C8.47008 1.52393 9.52992 1.52394 9.89674 2.26718L11.4124 5.33818C11.558 5.63332 11.8396 5.83789 12.1653 5.88522L15.5543 6.37768C16.3746 6.49686 16.7021 7.50483 16.1086 8.08337L13.6562 10.4738C13.4205 10.7035 13.313 11.0345 13.3686 11.3589L13.9475 14.7343C14.0877 15.5512 13.2302 16.1742 12.4966 15.7885L9.46534 14.1948C9.17402 14.0417 8.82598 14.0417 8.53466 14.1948L5.5034 15.7885C4.76978 16.1742 3.91235 15.5512 4.05246 14.7343L4.63137 11.3589C4.68701 11.0345 4.57946 10.7035 4.34378 10.4738L1.89144 8.08337C1.29792 7.50483 1.62543 6.49686 2.44565 6.37768L5.8347 5.88522C6.16041 5.83789 6.44197 5.63332 6.58764 5.33818L8.10326 2.26718Z"
                                fill="white"
                              />
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_12657_16865">
                              <rect width={18} height={18} fill="white" />
                            </clipPath>
                            <clipPath id="clip1_12657_16865">
                              <rect width={18} height={18} fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        {product.avgDanhGia !== 0 ? (
                          <span className="text-base font-medium text-white">
                            {Math.ceil(product.avgDanhGia ?? 0)}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y">
                <p className="font-medium text-lg text-gray-700 mb-2">
                  Kích thước: {product.kichthuoc}
                </p>
                <p className="font-medium text-lg text-gray-700 mb-2">
                  Khối lượng: {product.khoiluong}
                </p>
                <p className="font-medium text-lg text-gray-700 mb-2">
                  Thương hiệu: {product.thuonghieu}
                </p>
                <p className="font-medium text-lg text-gray-700 mb-2">
                  Xuất xứ: {product.xuatxu}
                </p>
              </div>

              <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center mb-8 gap-y-3">
                <div className="flex items-center">
                  <h5 className="font-manrope font-semibold text-2xl leading-9 text-rose-500 ">
                    {FormatVND({ amount: product.gia })}
                  </h5>
                </div>
                <svg
                  className="mx-5 max-[400px]:hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  width={2}
                  height={36}
                  viewBox="0 0 2 36"
                  fill="none"
                >
                  <path d="M1 0V36" stroke="#E5E7EB" />
                </svg>
              </div>

              <AddToCart product={product} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

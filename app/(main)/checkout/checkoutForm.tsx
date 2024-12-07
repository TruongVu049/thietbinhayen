"use client";
import ImageKit from "@/components/imagekit";
import { SubmitButton } from "@/components/submitButton";
import Address from "@/components/user/address";
import { FormatVND } from "@/helpers/utils";
import { CreateOrder } from "@/lib/db";
import { DiaChi, HoaDon, SanPhamThanhToan } from "@/lib/db/types";
import { User } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function CheckoutForm({
  user,
  products,
}: {
  user: User | null;
  products: SanPhamThanhToan[];
}) {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<DiaChi | null>(null);
  const [serviceFee, setServiceFee] = useState(0);
  const totalPrice = products.reduce(
    (prev, cur) => prev + cur.gia * (cur.soluongmua ?? 0),
    0
  );
  function handleUpdateSelectedAddress(address: DiaChi) {
    setSelectedAddress(address);
  }

  useEffect(() => {
    async function getServiceFee() {
      const items = products.map((item) => {
        const [length, width, height] = item.kichthuoc.split("x").map(Number);
        return {
          name: item.ten,
          quantity: item.soluongmua,
          height: height,
          weight: item.khoiluong,
          length: length,
          width: width,
        };
      });
      const totalWidth = items.reduce((prev, cur) => prev + cur.width, 0);
      const totalHeight = items.reduce((prev, cur) => prev + cur.height, 0);
      const totalLength = items.reduce((prev, cur) => prev + cur.length, 0);
      const totalWeight = items.reduce((prev, cur) => prev + cur.weight, 0);
      const dataServiceFree = {
        service_type_id: 2,
        from_district_id: Number(process.env.NEXT_PUBLIC_FROMDISTRICTID),
        from_ward_code: String(process.env.NEXT_PUBLIC_FROMWARDCODE),
        to_district_id: Number(selectedAddress?.idquanhuyen),
        to_ward_code: String(selectedAddress?.idphuongxa),
        height: totalHeight,
        length: totalLength,
        weight: totalWeight,
        width: totalWidth,
        insurance_value: 0,
        coupon: null,
        items: items,
      };
      const response = await fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ShopId: process.env.NEXT_PUBLIC_GHN_SHOPID || "",
            Token: process.env.NEXT_PUBLIC_GHN_TOKEN || "",
          },
          body: JSON.stringify(dataServiceFree),
        }
      );
      const dataRes = await response.json();
      if (dataRes?.code === 200) {
        setServiceFee(dataRes?.data?.total ?? 0);
      }
    }
    selectedAddress?.idquanhuyen && getServiceFee();
  }, [selectedAddress]);

  const actionCreate = CreateOrder.bind(null);

  return (
    <div className="flex flex-col gap-5 mt-8">
      <div className="p-4 bg-white shadow-md border border-gray-200 rounded-md">
        <Address
          user={user}
          selectedAddress={selectedAddress}
          onUpdateSelectedAddress={handleUpdateSelectedAddress}
        />
      </div>

      <form
        action={async (formdata: FormData) => {
          const convertToObject = Object.fromEntries(formdata.entries());
          const order: HoaDon = {
            id: 0,
            tongtien: totalPrice,
            phivanchuyen: serviceFee,
            diachinhanhang: `${selectedAddress?.sdt}, ${selectedAddress?.diachicuthe}, ${selectedAddress?.phuongxa}, ${selectedAddress?.quanhuyen}, ${selectedAddress?.tinhthanh}`,
            khachhang_id: Number(user?.id),
            chiTietHoaDons: products.map((item) => {
              return {
                sanpham_id: item.id ? item.id : 0,
                hoadon_id: 0,
                soluong: item.soluongmua ?? 0,
                dongia: item.gia,
              };
            }),
            nhatKyDonHangs: [
              {
                hoadon_id: 0,
                trangthaidonhang_id: 0,
                nhanvien_id: 0,
              },
            ],
            vanChuyen: {
              id: 0,
              trangthaigiao: "string",
              hoadon_id: 0,
              nhanvien_id: 0,
            },
            thanhToan: {
              id: 0,
              tongtien: totalPrice + serviceFee,
              trangthai: false,
              magiaodich: "",
              hoadon_id: 0,
              loaithanhtoan_id: convertToObject.bankCode === "VNBANK" ? 2 : 1,
            },
          };

          const res = await actionCreate(order);
          let isNavigating = false;
          if (res.status === 200) {
            console.log(order);
            if (order.thanhToan?.loaithanhtoan_id === 2) {
              try {
                // Gửi yêu cầu POST đến route API
                const resVnp = await fetch("/api/create_payment_url", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    amount: order.tongtien + order.phivanchuyen,
                    bankCode: convertToObject.bankCode,
                    language: convertToObject.language,
                    order: res.body.id,
                  }),
                });
                // Kiểm tra xem yêu cầu có thành công không
                if (resVnp.status === 200) {
                  const data = await resVnp.json();
                  data.url && router.push(data.url);
                } else {
                  console.error("Lỗi khi tạo URL thanh toán");
                }
              } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
              }
            } else {
              if (!isNavigating) {
                isNavigating = true;
                router.push(`/checkout/return?orderId=${res.body.id}`);
              }
            }
          } else {
            router.push("/checkout/return");
          }
        }}
        className="flex flex-col gap-5"
      >
        <div className="relative p-4 bg-white overflow-x-auto shadow-md border border-gray-200 rounded-md">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 whitespace-nowrap font-semibold "
                >
                  Sản Phẩm
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap" />

                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Đơn Giá
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Số Lượng
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Thành Tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length
                ? products.map((item) => (
                    <tr key={item.id} className="bg-white border-b ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        <div className="relative h-12 w-12 rounded-lg">
                          <ImageKit
                            path={item.hinhanh}
                            alt={item.hinhanh}
                            loading="lazy"
                          />
                        </div>
                      </th>
                      <td className="px-6 py-4 ">
                        <h4 className="line-clamp-1 md:text-base text-sm">
                          {item.ten}
                        </h4>
                      </td>
                      <td className="px-6 py-4 font-semibold whitespace-nowrap">
                        {FormatVND({ amount: item.gia })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        x {item.soluongmua}
                      </td>
                      <td className="px-6 py-4 font-semibold text-rose-500 whitespace-nowrap">
                        {FormatVND({
                          amount: item.gia * (item.soluongmua ?? 0),
                        })}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white shadow-md border border-gray-200 rounded-md">
          <h2 className="md:text-xl text-lg capitalize flex items-center gap-3">
            Phương Thức Thanh Toán
          </h2>
          <ul className="mt-3">
            <label className="cursor-pointer flex items-center">
              <input
                type="radio"
                name="bankCode"
                className="accent-rose-500 w-4 h-4"
                defaultValue="1"
                defaultChecked={true}
              />
              <p className="ml-3 flex gap-2 md:text-sm text-xs text-gray-800 items-center">
                <Image
                  src={"/static/images/logo-cod.png"}
                  height={200}
                  width={200}
                  className="h-auto w-10 rounded-full overflow-hidden"
                  alt="logo-zalo"
                />
                Thanh toán khi nhận hàng (COD)
              </p>
            </label>
            <label className="cursor-pointer flex items-center mt-3">
              <input
                id="bankCode"
                type="radio"
                name="bankCode"
                className="accent-rose-500 w-4 h-4"
                defaultValue="VNBANK"
              />
              <p className="ml-3 flex gap-2 md:text-sm text-xs text-gray-800 items-center">
                <Image
                  src={"/static/images/logo-vnpay.png"}
                  height={200}
                  width={200}
                  className="h-auto w-10 rounded-full overflow-hidden"
                  alt="logo-zalo"
                />
                Thanh toán qua Vnpay
              </p>
            </label>
          </ul>
        </div>
        <div className="p-4 bg-white shadow-md border border-gray-200 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="md:text-xl text-lg capitalize flex items-center gap-3">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 24 24"
                className="text-rose-500"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 5H3a1 1 0 0 0-1 1v4h.893c.996 0 1.92.681 2.08 1.664A2.001 2.001 0 0 1 3 14H2v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4h-1a2.001 2.001 0 0 1-1.973-2.336c.16-.983 1.084-1.664 2.08-1.664H22V6a1 1 0 0 0-1-1zM9 9a1 1 0 1 1 0 2 1 1 0 1 1 0-2zm-.8 6.4 6-8 1.6 1.2-6 8-1.6-1.2zM15 15a1 1 0 1 1 0-2 1 1 0 1 1 0 2z"></path>
              </svg>
            </h2>
          </div>
          <div className="mt-2 flex md:flex-row flex-col md:items-center md:justify-between gap-2" />
          <div className="lg:w-80 md:w-72  md:float-right">
            <h4 className="md:text-base text-sm flex justify-between items-center pb-2">
              Tổng tiền hàng:
              <span className="text-rose-500">
                {FormatVND({
                  amount: totalPrice,
                })}
              </span>
            </h4>
            <h4 className="md:text-base text-sm flex justify-between items-center pb-2">
              Phí vận chuyển:
              <span className="text-rose-500">
                {" "}
                {FormatVND({ amount: serviceFee })}
              </span>
            </h4>

            <h4 className="md:text-lg text-base flex justify-between items-center pb-2">
              Tổng thanh toán:
              <strong className="text-rose-500 md:text-2xl text-lg">
                {" "}
                {FormatVND({
                  amount: totalPrice + serviceFee,
                })}
              </strong>
              <input
                className="sr-only"
                type="text"
                name="amount"
                value={totalPrice + serviceFee}
              />
              <input
                type="radio"
                defaultChecked={true}
                className="sr-only"
                defaultValue={"vn"}
                name="language"
              />
            </h4>
          </div>
          <div className="clear-both" />
          <div className="md:mt-8 mt-4   flex md:items-center md:flex-row flex-col md:gap-0 gap-2 md:justify-between">
            <p>
              Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo{" "}
              <a className="text-blue-600 hover:text-blue-500" href="#">
                Điều khoản Shop
              </a>
            </p>

            {!selectedAddress ? (
              <button
                type="button"
                disabled={true}
                className="cursor-not-allowed  focus:outline-none w-1/2 opacity-50 px-6 rounded-s py-3 bg-indigo-500 hover:bg-indigo-400 text-white"
              >
                Dặt hàng
              </button>
            ) : (
              <SubmitButton label={"Đặt hàng"} cName="w-1/2" />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

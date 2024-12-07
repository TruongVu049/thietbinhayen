import { auth } from "@/auth";
import { FormatVND } from "@/helpers/utils";
import { getProductCheckout, orderpayment, postSendmail } from "@/lib/db";
import { HoaDon, SanPhamThanhToan } from "@/lib/db/types";
import { CheckCircle, CircleX } from "lucide-react";
import Link from "next/link";

export default async function VnpayReturnPage({
  searchParams,
}: {
  searchParams: {
    orderId: string;
    vnp_Amount?: string;
    vnp_BankCode?: string;
    vnp_BankTranNo?: string;
    vnp_CardType?: string;
    vnp_OrderInfo?: string;
    vnp_PayDate?: string;
    vnp_ResponseCode?: string;
    vnp_TmnCode?: string;
    vnp_TransactionNo?: string;
    vnp_TransactionStatus?: string;
    vnp_TxnRef?: string;
    vnp_SecureHash?: string;
  };
}) {
  const session = await auth();
  const data = {
    orderId: searchParams.orderId,
    vnp_Amount: searchParams.vnp_Amount ?? null,
    vnp_BankCode: searchParams.vnp_BankCode ?? null,
    vnp_BankTranNo: searchParams.vnp_BankTranNo ?? null,
    vnp_CardType: searchParams.vnp_CardType ?? null,
    vnp_OrderInfo: searchParams.vnp_OrderInfo ?? null,
    vnp_PayDate: searchParams.vnp_PayDate ?? null,
    vnp_ResponseCode: searchParams.vnp_ResponseCode ?? null,
    vnp_TmnCode: searchParams.vnp_TmnCode ?? null,
    vnp_TransactionNo: searchParams.vnp_TransactionNo ?? null,
    vnp_TransactionStatus: searchParams.vnp_TransactionStatus ?? null,
    vnp_TxnRef: searchParams.vnp_TxnRef ?? null,
    vnp_SecureHash: searchParams.vnp_SecureHash ?? null,
  };
  const url = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (key !== "orderId" && key !== "vnp_SecureHash") {
      url.append(key, value as string);
    }
  }
  const res = await orderpayment({
    OrderId: data.orderId,
    VnpResponseCode: data.vnp_ResponseCode ?? "",
    VnpTransactionStatus: data.vnp_TransactionStatus ?? "",
    VnpTxnRef: data.vnp_TxnRef ?? "",
    hashData: url.toString(),
    VnpSecureHash: data.vnp_SecureHash ?? "",
    VnpPayDate: data.vnp_PayDate ?? "",
  });

  // if (res.status === 200) {
  //   try {
  //     const order = res.body as HoaDon;
  //     if (order.chiTietHoaDons) {
  //       const products = await getProductCheckout(order.chiTietHoaDons);
  //       if (products) {
  //         const strHtml = products
  //           ?.map((item) => {
  //             return `<tr>
  //                   <td style="padding-bottom:10px">
  //                       <table style="width:100%" cellpadding="0" cellspacing="0" border="0">
  //                           <tbody><tr>
  //                               <td>
  //                                   <img src="https://ik.imagekit.io/truongvuu049/tr:h-800,w-600/${
  //                                     item.hinhanh
  //                                   }" width="100" height="100" alt="" style="float:left;margin-right:10px" class="CToWUd" data-bit="iit">
  //                               </td>
  //                               <td>
  //                               <div style="font-weight:700;text-transform:uppercase;margin-bottom:5px">${
  //                                 item.ten
  //                               }</div>
  //                               </td>
  //                           </tr>
  //                       </tbody></table>
  //                   </td>
  //                   <td style="vertical-align:top;text-align:right;padding-bottom:10px">${FormatVND(
  //                     { amount: item.gia }
  //                   )}</td>
  //                   <td style="vertical-align:top;text-align:center;padding-bottom:10px">${FormatVND(
  //                     { amount: item.soluongmua ?? 0 }
  //                   )}</td>

  //                   <td style="vertical-align:top;padding-bottom:10px;text-align:right">${FormatVND(
  //                     { amount: item.gia * (item.soluongmua ?? 0) }
  //                   )}</td>
  //               </tr>`;
  //           })
  //           .join(" ");
  //         const response = await postSendmail(
  //           JSON.stringify({
  //             to: session?.user.email,
  //             subject: `Đơn hàng #${data.orderId}"`,
  //             text: "",
  //             html: `<table style="font-family:arial;line-height:16px;font-size:13px;background-color:#f8f8f8;width:100%;color:#414141"> <tbody> <tr> <td> <table style="border-style:solid;border-color:#e5e5e5;border-width:1px;background-color:#fff;width:600px;margin-left:auto;margin-right:auto" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="text-align:center"> <table cellpadding="0" cellspacing="0" border="0" style="width:100%"> <tbody> </tbody> </table> </td> </tr> <tr> <td> <section> </section> </td> </tr> <tr> <td style="padding-top:20px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <div style="font-size:17px;margin-bottom:15px"><strong>Cảm ơn quý khách đã đặt hàng tại MMM</a></strong></div> <div style="margin-bottom:15px">MMM rất vui thông báo đơn hàng <span style="color:#336e51"> ${
  //               order.id ?? -1
  //             } </span> của quý khách đang trong quá trình xử lý.<br> </div> </td> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <table style="border-style:solid;border-color:#f0f2f0;border-width:1px;width:100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <p><b>Địa chỉ giao hàng</b></p> <div style="margin-bottom:20px"> <br> ${
  //               order.diachinhanhang
  //             } </div> </td> </tr> </tbody> </table> </td> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <table style="border-style:solid;border-color:#f0f2f0;border-width:1px;width:100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="background-color:#f0f2f0;padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;font-weight:700"> <div>CHI TIẾT ĐƠN HÀNG</div> </td> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <table style="width:100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td width="320px" style="padding-bottom:10px"><b>Sản phẩm</b></td> <td width="80px" style="text-align:right;padding-bottom:10px"><b>Đơn giá </b></td> <td width="100px" style="text-align:center;padding-bottom:10px"><b>Số Lượng</b></td> <td width="100px" style="text-align:right;padding-bottom:10px"><b>Thành tiền</b></td> </tr> ${strHtml} <td colspan="3" width="500" style="text-align:right;border-top-style:solid;border-top-color:#e5e5e5;border-top-width:1px;padding-top:10px"> Thành tiền:</td> <td style="vertical-align:top;padding-bottom:10px;text-align:right;font-weight:700;border-top-style:solid;border-top-color:#e5e5e5;border-top-width:1px;padding-top:10px"> ${FormatVND(
  //               { amount: order.tongtien }
  //             )}</td> </tr> <tr> <td colspan="3" width="500" style="text-align:right">Chi phí vận chuyển: </td> <td style="vertical-align:top;padding-bottom:10px;text-align:right;font-weight:700"> ${FormatVND(
  //               { amount: order.phivanchuyen }
  //             )}</td> </tr> <tr> <td colspan="3" width="500" style="text-align:right">Tổng cộng:</td> <td style="vertical-align:top;padding-bottom:10px;text-align:right;font-weight:700"> ${FormatVND(
  //               { amount: order.phivanchuyen + order.tongtien }
  //             )}</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> </tr> </tbody> </table>`,
  //           })
  //         );
  //         if (!response.ok) {
  //           console.log(response);
  //         }
  //       }
  //     }
  //   } catch (err: unknown) {
  //     const errorMessage =
  //       err instanceof Error
  //         ? err.message
  //         : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
  //     console.log(errorMessage);
  //   }
  // }

  if (res.status === 200) {
    const order = res.body as HoaDon;

    if (order?.chiTietHoaDons) {
      const products = await getProductCheckout(order.chiTietHoaDons);

      if (products) {
        const emailHtml = generateOrderEmailHtml(order, products);
        await sendOrderConfirmationEmail(
          session?.user.email,
          data.orderId,
          emailHtml
        );
      }
    }
  }

  return (
    <main className="max-w-screen-xl block mx-auto ">
      <div className="w-full flex items-center justify-center ">
        <div className="max-w-lg w-[400px] md:mt-32 mt-24 flex flex-col gap-3 text-center justify-center items-center bg-white border-gray-100 border-4 rounded-lg shadow-md p-4">
          {res.status === 200 ? (
            <CheckCircle className="md:w-24 md:h-24 h-12 w-12 text-green-500" />
          ) : (
            <CircleX className="md:w-24 md:h-24 h-12 w-12 text-rose-500" />
          )}
          <p className="md:text-lg text-base">
            {res.status === 200
              ? "Chúc mừng bạn đã đặt hàng thành công."
              : res.body}
          </p>
          <div className="w-full flex items-center justify-between gap-4 md:flex-nowrap flex-wrap">
            <Link
              href={"/search"}
              className="w-full px-4 py-2 rounded-md border border-gray-800 text-gray-800"
            >
              {res.status === 200 ? "Mua thêm" : "Mua lại"}
            </Link>
            <Link
              href={"/don-hang"}
              className="w-full px-4 py-2 rounded-md border border-gray-800 text-white bg-gray-800 hover:bg-gray-700"
            >
              Đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function generateOrderEmailHtml(order: HoaDon, products: SanPhamThanhToan[]) {
  const productRows = products
    .map(
      (item) => `<tr>
                    <td style="padding-bottom:10px">
                        <table style="width:100%" cellpadding="0" cellspacing="0" border="0">
                            <tbody><tr>
                                <td>
                                    <img src="https://ik.imagekit.io/truongvuu049/tr:h-800,w-600/${
                                      item.hinhanh
                                    }" width="100" height="100" alt="" style="float:left;margin-right:10px" class="CToWUd" data-bit="iit">
                                </td>
                                <td>
                                <div style="font-weight:700;text-transform:uppercase;margin-bottom:5px">${
                                  item.ten
                                }</div>
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                    <td style="vertical-align:top;text-align:right;padding-bottom:10px">${FormatVND(
                      { amount: item.gia }
                    )}</td>
                    <td style="vertical-align:top;text-align:center;padding-bottom:10px">${FormatVND(
                      { amount: item.soluongmua ?? 0 }
                    )}</td>

                    <td style="vertical-align:top;padding-bottom:10px;text-align:right">${FormatVND(
                      { amount: item.gia * (item.soluongmua ?? 0) }
                    )}</td>
                </tr>`
    )
    .join("");

  return `
    <table style="font-family:arial;line-height:16px;font-size:13px;background-color:#f8f8f8;width:100%;color:#414141"> <tbody> <tr> <td> <table style="border-style:solid;border-color:#e5e5e5;border-width:1px;background-color:#fff;width:600px;margin-left:auto;margin-right:auto" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="text-align:center"> <table cellpadding="0" cellspacing="0" border="0" style="width:100%"> <tbody> </tbody> </table> </td> </tr> <tr> <td> <section> </section> </td> </tr> <tr> <td style="padding-top:20px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <div style="font-size:17px;margin-bottom:15px"><strong>Cảm ơn quý khách đã đặt hàng tại MMM</a></strong></div> <div style="margin-bottom:15px">MMM rất vui thông báo đơn hàng <span style="color:#336e51"> ${
      order.id ?? -1
    } </span> của quý khách đang trong quá trình xử lý.<br> </div> </td> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <table style="border-style:solid;border-color:#f0f2f0;border-width:1px;width:100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <p><b>Địa chỉ giao hàng</b></p> <div style="margin-bottom:20px"> <br> ${
    order.diachinhanhang
  } </div> </td> </tr> </tbody> </table> </td> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <table style="border-style:solid;border-color:#f0f2f0;border-width:1px;width:100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="background-color:#f0f2f0;padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;font-weight:700"> <div>CHI TIẾT ĐƠN HÀNG</div> </td> </tr> <tr> <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"> <table style="width:100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td width="320px" style="padding-bottom:10px"><b>Sản phẩm</b></td> <td width="80px" style="text-align:right;padding-bottom:10px"><b>Đơn giá </b></td> <td width="100px" style="text-align:center;padding-bottom:10px"><b>Số Lượng</b></td> <td width="100px" style="text-align:right;padding-bottom:10px"><b>Thành tiền</b></td> </tr> ${productRows} <td colspan="3" width="500" style="text-align:right;border-top-style:solid;border-top-color:#e5e5e5;border-top-width:1px;padding-top:10px"> Thành tiền:</td> <td style="vertical-align:top;padding-bottom:10px;text-align:right;font-weight:700;border-top-style:solid;border-top-color:#e5e5e5;border-top-width:1px;padding-top:10px"> ${FormatVND(
    { amount: order.tongtien }
  )}</td> </tr> <tr> <td colspan="3" width="500" style="text-align:right">Chi phí vận chuyển: </td> <td style="vertical-align:top;padding-bottom:10px;text-align:right;font-weight:700"> ${FormatVND(
    { amount: order.phivanchuyen }
  )}</td> </tr> <tr> <td colspan="3" width="500" style="text-align:right">Tổng cộng:</td> <td style="vertical-align:top;padding-bottom:10px;text-align:right;font-weight:700"> ${FormatVND(
    { amount: order.phivanchuyen + order.tongtien }
  )}</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> </tr> </tbody> </table>`;
}

async function sendOrderConfirmationEmail(
  to: string | undefined,
  orderId: string,
  html: string
) {
  if (!to) throw new Error("User email is missing.");
  const response = await postSendmail(
    JSON.stringify({
      to,
      subject: `Đơn hàng #${orderId}`,
      text: "",
      html,
    })
  );
  if (!response.ok) console.error("Gửi mail thất bại:", response);
}

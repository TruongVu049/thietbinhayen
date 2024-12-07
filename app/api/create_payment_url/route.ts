import { getVietnamDateTime } from "@/helpers/utils";
import { NextResponse } from "next/server";
import { getVPNSecureHash } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, language, order } = body;

    process.env.TZ = "Asia/Ho_Chi_Minh";

    const createDate = getVietnamDateTime();
    const expire = getVietnamDateTime(15);
    const ipAddress = req.headers.get("x-forwarded-for");

    const tmnCode: string = process.env.NEXT_PUBLIC_VNP_TMNCODE ?? "";
    const secretKey: string = process.env.NEXT_PUBLIC_VNP_HASHSECRET ?? "";
    const vnpUrl: string = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl: string = `${
      process.env.NEXT_PUBLIC_URL_HOST ?? ""
    }/checkout/return`;

    const date = new Date();
    const orderId = date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\D/g, "");
    const locale: string = language ? language : "vn";

    const orderParam = new URLSearchParams();
    orderParam.append("orderId", JSON.stringify(order));

    const hashdata = {
      vnp_Amount: amount * 100,
      vnp_Command: "pay",
      vnp_CreateDate: createDate,
      vnp_CurrCode: "VND",
      vnp_ExpireDate: expire,
      vnp_IpAddr: ipAddress,
      vnp_Locale: locale,
      vnp_OrderInfo: `Thanh toan GD: ${orderId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: `${returnUrl}?${orderParam}`,
      vnp_TmnCode: tmnCode,
      vnp_TxnRef: orderId,
      vnp_Version: "2.1.0",
    };

    // let hashdata = `?vnp_Amount=${
    //   amount * 100
    // }&vnp_Command=pay&vnp_CreateDate=${createDate}&vnp_CurrCode=VND&vnp_ExpireDate=${expire}&vnp_IpAddr=%3A%3A1&vnp_Locale=${locale}&vnp_OrderInfo=Thanh+toan+GD%3A${orderId}&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000%2Fcheckout%2Freturn&vnp_TmnCode=3GFXS4IL&vnp_TxnRef=${orderId}&vnp_Version=2.1.0`;

    const url = new URLSearchParams();

    for (const [key, value] of Object.entries(hashdata)) {
      url.append(key, value as string);
    }

    const vnp_SecureHash = await getVPNSecureHash(secretKey, url.toString());

    const redirectUrl = `${vnpUrl}?${url.toString()}&vnp_SecureHash=${
      vnp_SecureHash.vpn_secureHash
    }`;
    return NextResponse.json(
      { message: "Success", url: redirectUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error processing request." },
      { status: 500 }
    );
  }
}

// "http://localhost:3000/checkout/return?order=%7B%22id%22%3A0%2C%22tongtien%22%3A11184000%2C%22phivanchuyen%22%3A61501%2C%22diachinhanhang%22%3A%220383433234%2C+123%2C+X%C3%A3+B%E1%BA%A3n+M%E1%BA%BF%2C+Huy%E1%BB%87n+Si+Ma+Cai%2C+L%C3%A0o+Cai%22%2C%22khachhang_id%22%3A7%2C%22chiTietHoaDons%22%3A%5B%7B%22sanpham_id%22%3A14%2C%22hoadon_id%22%3A0%2C%22soluong%22%3A3%2C%22dongia%22%3A28000%7D%2C%7B%22sanpham_id%22%3A15%2C%22hoadon_id%22%3A0%2C%22soluong%22%3A3%2C%22dongia%22%3A3700000%7D%5D%2C%22nhatKyDonHangs%22%3A%5B%7B%22hoadon_id%22%3A0%2C%22trangthaidonhang_id%22%3A0%2C%22nhanvien_id%22%3A0%7D%5D%2C%22vanChuyen%22%3A%7B%22id%22%3A0%2C%22trangthaigiao%22%3A%22string%22%2C%22hoadon_id%22%3A0%2C%22nhanvien_id%22%3A0%7D%2C%22thanhToan%22%3A%7B%22id%22%3A0%2C%22tongtien%22%3A11245501%2C%22trangthai%22%3Afalse%2C%22magiaodich%22%3A%22%22%2C%22hoadon_id%22%3A0%2C%22loaithanhtoan_id%22%3A2%7D%7D"

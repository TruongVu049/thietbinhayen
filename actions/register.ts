"use server";
import * as z from "zod";
import { registerSchema } from "@/schemas";
import { postSendmail } from "@/lib/db";
import { cookies } from "next/headers";

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Auth/Register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      return {
        error: "Email này đã được sử dụng. Vui lòng điền email khác!",
      };
    }

    const newCus = await res.json();

    const url =
      process.env.NEXT_PUBLIC_URL_HOST +
      "/verify?token=" +
      newCus.token +
      "&email=" +
      newCus.email;
    console.log("url", url);

    const response = await postSendmail(
      JSON.stringify({
        to: data.email,
        subject: "Xác thực tài khoản",
        text: "Xác thực tài khoản",
        html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Mã xác minh</title> <style> body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333333; margin: 0; padding: 0; } table { max-width: 600px; margin: 20px auto; border-spacing: 0; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); } th, td { padding: 16px; text-align: left; } .header { background-color: #4184f3; color: #ffffff; text-align: center; padding: 20px 0; font-size: 20px; font-weight: bold; } .content { padding: 20px; font-size: 16px; line-height: 1.6; } .button { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #4184f3; text-decoration: none; border-radius: 4px; margin-top: 20px; } .footer { text-align: center; padding: 10px; background-color: #f2f2f2; font-size: 12px; color: #777777; } </style> </head> <body> <table> <!-- Header --> <tr> <td class="header">Mã xác minh MMM</td> </tr> <!-- Nội dung chính --> <tr> <td class="content"> <p>Xin chào,</p> <p> Vui lòng nhấn vào liên kết dưới đây để xác minh tài khoản của bạn: </p> <div style="text-align: center;"> <a href="${url}" class="button" >Xác minh tài khoản</a > </div> <p> Hoặc sao chép đường dẫn sau và dán vào trình duyệt của bạn: <br /> <a href="${url}"> ${url} </a> </p> <p>Trân trọng,</p> <p>Đội ngũ hỗ trợ MMM</p> </td> </tr> <!-- Footer --> <tr> <td class="footer"> <p> Địa chỉ: 123 Đường ABC, Thành phố XYZ | Email: support@ythietbinhayen.com </p> </td> </tr> </table> </body> </html>`,
      })
    );

    if (!response.ok) throw Error("");
    return {
      success:
        "Mã xác thực đã được gửi về email của bạn. Hãy kiểm tra và xác thực!",
    };
  } catch (err) {
    return {
      error: "Máy chủ không phản hồi. Vui lòng thực hiện lại!",
    };
  }
};

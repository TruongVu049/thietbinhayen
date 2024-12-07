"use server";
// Đặt biến môi trường cho phép bỏ qua SSL
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export const resendToken = async (token: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Auth/ResendToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );
    const data = await res.json();
    if (res.status === 404) {
      return {
        error: "Không tìm thấy token hợp lệ!",
        status: 404,
      };
    }

    const url =
      process.env.NEXT_PUBLIC_URL_HOST + "/verify?token=" + data.token;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_HOST}/api/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: data.email,
          subject: "Xác thực tài khoản",
          text: "Xác thực tài khoản",
          html: `<!DOCTYPE html> <html> <head> <meta charset="utf-8" /> <title></title> </head> <body> <table border="0" cellspacing="0" cellpadding="0" style="max-width:600px"> <tbody> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td align="left"> <span class="il">MMM</span> </td> <td align="right"> </td> </tr> </tbody> </table> </td> </tr> <tr height="16"></tr> <tr> <td> <table bgcolor="#4184F3" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #e0e0e0;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px"> <tbody> <tr> <td height="72px" colspan="3"></td> </tr> <tr> <td width="32px"></td> <td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:24px;color:#ffffff;line-height:1.25">Mã xác minh <span class="il">MMM</span></td> <td width="32px"></td> </tr> <tr> <td height="18px" colspan="3"></td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table bgcolor="#FAFAFA" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #f0f0f0;border-bottom:1px solid #c0c0c0;border-top:0;border-bottom-left-radius:3px;border-bottom-right-radius:3px"> <tbody> <tr height="16px"> <td width="32px" rowspan="3"></td> <td></td> <td width="32px" rowspan="3"></td> </tr> <tr> <td> <p>Xin chào!</p> <p> Mã xác minh bạn cần dùng để truy cập vào Tài khoản <span class="il">MMM</span> của mình ( <span style="color:#659cef" dir="ltr"> <a href="mailto:${data.email}" target="_blank">${data.email}</a> </span>) là: </p> <div style="text-align:center"> <p dir="ltr"><strong style="text-align:center;font-size:24px;font-weight:bold"> <a href="${url}">Chọn vào đây để tiến hành xác minh</a> </strong></p> </div> <p> Trân trọng!</p> </td> </tr> <tr height="32px"></tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>`,
        }),
      }
    );

    if (!response.ok) throw Error("");

    return {
      success:
        "Mã xác thực đã được gửi về email của bạn. Hãy kiểm tra và xác thực!",
      status: 200,
    };
  } catch (err) {
    return {
      error: "Máy chủ không phản hồi. Vui lòng thực hiện lại!",
      status: 500,
    };
  }
};

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, text, html, from } = body;

    // Cấu hình SMTP với tài khoản email của bạn
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Sử dụng Gmail SMTP
      port: 587,
      secure: false, // true cho 465, false cho các cổng khác
      auth: {
        user: process.env.EMAIL_USER, // Đặt biến môi trường cho email
        pass: process.env.EMAIL_PASS, // Đặt biến môi trường cho mật khẩu
      },
    });

    // Cấu hình email sẽ gửi
    const mailOptions = {
      from: from ?? process.env.EMAIL_USER, // Địa chỉ email của người gửi
      to, // Địa chỉ email người nhận
      subject, // Chủ đề email
      text, // Nội dung văn bản thuần túy
      html, // Nội dung HTML
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email." },
      { status: 500 }
    );
  }
}

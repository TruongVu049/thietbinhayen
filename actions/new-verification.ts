"use server";
export const newVerification = async (token: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Auth/ConfirmEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );
    if (res.status === 400) {
      return {
        error: "Mã xác thực đã hết hạn!",
        status: 400,
      };
    } else if (res.status === 404) {
      return {
        error: "Mã xác thực không đúng!",
        status: 404,
      };
    }
    return { success: "Xác thực thành công", status: 200 };
  } catch (err) {
    return {
      error: "Máy chủ không phản hồi. Vui lòng thực hiện lại!",
      status: 500,
    };
  }
};

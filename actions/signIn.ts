"use server";
import * as z from "zod";
import { signInSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
export async function signInWithCredentials(
  values: z.infer<typeof signInSchema>,
  callbackUrl?: string | null
) {
  const validatedFields = signInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Vui lòng điền vào email và mật khẩu!" };
  }

  const { email, password } = validatedFields.data;

  const res = await getUser(email, password);
  const user = await res.json();

  if (!res.ok) {
    if (res.status < 500) {
      return { error: "Thông tin đăng nhập không chính xác!" };
    }
    return { error: "Máy chủ không phản hồi. Vui lòng thực hiện lại!" };
  }

  if (!user) return { error: "Thông tin đăng nhập không chính xác!" };

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || "/",
    });
    return { success: "Đăng nhập thành công" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Đã xảy ra lỗi. Vui lòng thưc hiện lại" };
        default:
          return { error: "Đã xảy ra lỗi. Vui lòng thưc hiện lại" };
      }
    }
    throw error;
  }
}
export async function signInWithGithub() {
  await signIn("github", { redirectTo: "/" });
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

export async function getUser(email: string, password: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Auth/Login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    }
  );
  return res;
}

export async function GetUserOauth(id: string, email: string, name: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Auth/OAuth`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        name: name,
        password: id,
      }),
    }
  );
  return response;
}

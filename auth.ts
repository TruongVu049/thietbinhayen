import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { GetUserOauth, getUser } from "./actions/signIn";
import { signInSchema } from "@/schemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = signInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const res = await getUser(email, password);
          if (!res) return null;
          const user = await res.json();
          console.log("user-authorize", user);
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        // Gửi request lên API của bạn để tạo JWT từ server
        const response = await GetUserOauth(
          user?.id as string,
          profile.email as string,
          profile.name as string
        );
        if (!response.ok) {
          throw new Error("Tài khoản đã tồn tại hoặc có lỗi xảy ra.");
        }

        const data = await response.json();

        // Lưu JWT từ server trong token của NextAuth
        if (data.token) {
          token.userid = data?.id;
          token.accessToken = data.token;
        }
      } else {
        if (user) {
          if (user?.roles) {
            token.roles = user.roles;
          }
          token.userid = user.id;
          token.accessToken = (user as any).token || ""; // Lưu JWT hoặc Google token
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.sessionToken = token.accessToken as string; // Gắn JWT vào session
      session.user.roles = token.roles; // Lưu vai trò vào session
      session.user.id = token.userid;
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   console.log(url, baseUrl);
    //   if (url.startsWith(baseUrl) || url.startsWith("/")) return url;
    //   return baseUrl;
    // },
  },

  session: { strategy: "jwt" },
  secret: "KFwL2BkQLt7yJxY7Zq1CPXSOVBOvjGGvP4eYfh3BYvVwOEsMaIWmZbXD6G0Pc0J0",
});

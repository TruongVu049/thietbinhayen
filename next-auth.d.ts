import NextAuth from "next-auth";
import { roleType } from "./lib/types";

declare module "next-auth" {
  interface User {
    roles: roleTypee[];
  }

  interface Session {
    user: {
      roles: roleType[];
    } & DefaultSession["user"];
  }

  interface JWT {
    roles: roleType[];
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  adminRoutes,
} from "@/routes";
import { checkExistingRoute } from "./helpers/utils";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = apiAuthPrefix.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isAdminRoute = checkExistingRoute(adminRoutes, nextUrl.pathname);
  const isPublicRoute = checkExistingRoute(publicRoutes, nextUrl.pathname);

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (isLoggedIn) {
    const user = req.auth?.user;
    if (isAdminRoute) {
      if (user.roles) {
        if (
          checkExistingRoute(
            user?.roles.map((item: { duongdan: string }) => item?.duongdan),
            nextUrl.pathname
          )
        ) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(
              user?.roles.filter(
                (item: { duongdan: string }) =>
                  item?.duongdan[item?.duongdan.length - 1] !== "/"
              )[0].duongdan,
              nextUrl
            )
          );
        }
      } else {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    } else {
      if (user.roles) {
        return NextResponse.redirect(
          new URL(
            user?.roles.filter(
              (item: { duongdan: string }) =>
                item?.duongdan[item?.duongdan.length - 1] !== "/"
            )[0].duongdan,
            nextUrl
          )
        );
      }
      return NextResponse.next();
    }
  } else {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL(`/`, nextUrl));
    } else if (!isPublicRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return NextResponse.redirect(
        new URL(`/signIn?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }
    return NextResponse.next();
  }
});
// Manage list of protected routes
// export const config = {
//   matcher: ["/thong-tin/:path*", "/another-protected-route/:path*"],
// };
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
